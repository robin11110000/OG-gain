import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { WalletConnectionSchema } from '@/lib/mongodb/schemas';
import mongoose from 'mongoose';
import { getSession } from '@/lib/auth';

/**
 * GET /api/wallet/connections
 * Get user's wallet connections (both MetaMask and Orb)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const walletType = searchParams.get('type'); // 'metamask' or 'orb'
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Connect to database
    await connectDB();
    
    // Get the model
    const WalletConnection = mongoose.models.WalletConnection || 
      mongoose.model('WalletConnection', WalletConnectionSchema);
    
    // Build query filters
    const filters: any = { userId: session.user.id };
    
    // Filter by wallet type if provided
    if (walletType && ['metamask', 'orb'].includes(walletType)) {
      filters.walletType = walletType;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute the query
    const connections = await WalletConnection.find(filters)
      .sort({ lastUsed: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const totalCount = await WalletConnection.countDocuments(filters);
    
    return NextResponse.json({
      success: true,
      data: connections,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching wallet connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet connections' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wallet/connections
 * Remove a wallet connection
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { connectionId } = await request.json();
    
    // Validate input
    if (!connectionId || !mongoose.Types.ObjectId.isValid(connectionId)) {
      return NextResponse.json(
        { error: 'Valid connection ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Get the model
    const WalletConnection = mongoose.models.WalletConnection || 
      mongoose.model('WalletConnection', WalletConnectionSchema);
    
    // Find and verify the connection belongs to the user
    const connection = await WalletConnection.findOne({
      _id: connectionId,
      userId: session.user.id
    });
    
    if (!connection) {
      return NextResponse.json(
        { error: 'Wallet connection not found or not owned by user' },
        { status: 404 }
      );
    }
    
    // Delete the connection
    await WalletConnection.deleteOne({ _id: connectionId });
    
    return NextResponse.json({
      success: true,
      message: 'Wallet connection removed successfully',
    });
  } catch (error) {
    console.error('Error removing wallet connection:', error);
    return NextResponse.json(
      { error: 'Failed to remove wallet connection' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/connections
 * Add a new wallet connection (for Orb wallet specifically)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { walletAddress, walletType = 'orb' } = await request.json();
    
    // Validate input
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!['metamask', 'orb'].includes(walletType)) {
      return NextResponse.json(
        { error: 'Invalid wallet type' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Get the model
    const WalletConnection = mongoose.models.WalletConnection || 
      mongoose.model('WalletConnection', WalletConnectionSchema);
    
    // Check if connection already exists
    const existingConnection = await WalletConnection.findOne({
      walletAddress: walletAddress.toLowerCase(),
      userId: session.user.id
    });
    
    if (existingConnection) {
      return NextResponse.json(
        { error: 'Wallet already connected' },
        { status: 400 }
      );
    }
    
    // Create new connection
    const newConnection = new WalletConnection({
      userId: session.user.id,
      walletAddress: walletAddress.toLowerCase(),
      walletType,
      connectedAt: new Date(),
      lastUsed: new Date(),
      isActive: true
    });
    
    await newConnection.save();
    
    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      data: newConnection
    });
  } catch (error) {
    console.error('Error adding wallet connection:', error);
    return NextResponse.json(
      { error: 'Failed to add wallet connection' },
      { status: 500 }
    );
  }
}