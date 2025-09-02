import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb/connection';
import User from '@/lib/mongodb/models/User';
import { ethers } from 'ethers';
import { verifyMessage } from '@ambire/signature-validator';

/**
 * Generate a nonce for the user authentication process
 */
async function generateNonce(walletAddress: string, walletType: string): Promise<string> {
  const randomBytes = ethers.utils.randomBytes(32);
  const nonce = ethers.utils.hexlify(randomBytes);
  return `${nonce}-${Date.now()}-${walletAddress.toLowerCase()}-${walletType}`;
}

/**
 * Enhanced signature verification supporting both EOA and smart contract wallets
 */
async function verifySignature(
  message: string,
  signature: string,
  walletAddress: string,
  walletType: 'metamask' | 'orb'
): Promise<boolean> {
  try {
    if (walletType === 'metamask') {
      // Traditional EOA verification
      const signerAddress = ethers.utils.verifyMessage(message, signature);
      return signerAddress.toLowerCase() === walletAddress.toLowerCase();
    } else {
      // Smart contract wallet verification using Ambire's validator
      const isValid = await verifyMessage({
        signer: walletAddress,
        message,
        signature,
        provider: new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
      });
      return isValid;
    }
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * GET /api/auth/wallet
 * Generate a nonce for wallet authentication
 */
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.nextUrl.searchParams.get('walletAddress');
    const walletType = request.nextUrl.searchParams.get('type') || 'metamask';

    if (!walletAddress || !['metamask', 'orb'].includes(walletType)) {
      return NextResponse.json(
        { error: 'Valid wallet address and type are required' },
        { status: 400 }
      );
    }

    const nonce = await generateNonce(walletAddress, walletType);
    const message = `Sign this message to authenticate with OrbitYield: ${nonce}`;

    return NextResponse.json({ 
      success: true, 
      nonce,
      message,
      walletType
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication nonce' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/wallet
 * Authenticate a user with their wallet (MetaMask or Orb)
 */
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, nonce, walletType = 'metamask' } = await request.json();

    // Input validation
    if (!walletAddress || !signature || !nonce) {
      return NextResponse.json(
        { error: 'Wallet address, signature, and nonce are required' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = await verifySignature(nonce, signature, walletAddress, walletType);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find or create user with wallet connection
    let user = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: { lastLogin: new Date() },
        $addToSet: { 
          connectedWallets: {
            address: walletAddress.toLowerCase(),
            type: walletType,
            lastUsed: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    // Create session token
    const sessionToken = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`${user._id}-${Date.now()}-${walletAddress}`)
    );

    // Update user with session
    user = await User.findByIdAndUpdate(
      user._id,
      { $set: { sessionToken } },
      { new: true }
    );

    // Secure response data
    const userData = {
      id: user._id,
      walletAddress: user.walletAddress,
      sessionToken,
      connectedWallets: user.connectedWallets.map(wallet => ({
        address: wallet.address,
        type: wallet.type,
        lastUsed: wallet.lastUsed
      })),
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}