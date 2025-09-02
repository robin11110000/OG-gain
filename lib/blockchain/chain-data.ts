import { getProvider } from './contract-utils';
import { ethers } from 'ethers';

/**
 * Struct to hold chain information
 */
export interface ChainInfo {
  name: string;
  tokenSymbol: string;
  tokenDecimals: number;
  blockHeight: number;
  finalized?: number;
  lastBlockTime?: Date;
  nodesCount?: number;
  isTestnet: boolean;
  explorerUrl: string;
}

/**
 * Fetches gas price from EVM-compatible chains
 * @returns Current gas price in gwei
 */
export async function fetchGasPrice(): Promise<string> {
  try {
    const provider = getProvider();
    const gasPrice = await provider.getFeeData();
    
    // Convert to gwei for display
    return ethers.utils.formatUnits(gasPrice.gasPrice || 0, 'gwei');
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return '0';
  }
}

/**
 * Fetch token price from an API
 * @param token Token symbol (e.g., DOT)
 * @returns Token price in USD
 */
export async function fetchTokenPrice(token: string): Promise<number> {
  try {
    // Replace with your preferred price API
    // This is just a placeholder implementation
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${mapTokenToId(token)}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch token price');
    }
    
    const data = await response.json();
    const tokenId = mapTokenToId(token);
    
    return data[tokenId]?.usd || 0;
  } catch (error) {
    console.error(`Error fetching ${token} price:`, error);
    return 0;
  }
}

/**
 * Maps token symbols to IDs used by CoinGecko API
 */
function mapTokenToId(token: string): string {
  const tokenMap: Record<string, string> = {
    'OG': '0g-storage',
  };
  
  return tokenMap[token.toUpperCase()] || token.toLowerCase();
}

/**
 * Calculate APR to APY conversion
 * @param apr Annual Percentage Rate
 * @param compoundingFrequency Number of times compounded per year
 * @returns Annual Percentage Yield
 */
export function aprToApy(apr: number, compoundingFrequency: number = 365): number {
  return Math.pow(1 + apr / 100 / compoundingFrequency, compoundingFrequency) * 100 - 100;
}

/**
 * Calculate APY to APR conversion
 * @param apy Annual Percentage Yield
 * @param compoundingFrequency Number of times compounded per year
 * @returns Annual Percentage Rate
 */
export function apyToApr(apy: number, compoundingFrequency: number = 365): number {
  return (Math.pow(1 + apy / 100, 1 / compoundingFrequency) - 1) * compoundingFrequency * 100;
}

/**
 * Calculate estimated earnings based on investment amount and APY
 * @param amount Investment amount
 * @param apy Annual Percentage Yield
 * @param durationDays Investment duration in days
 * @returns Estimated earnings
 */
export function calculateEstimatedEarnings(amount: number, apy: number, durationDays: number): number {
  // Convert APY to daily rate
  const dailyRate = Math.pow(1 + apy / 100, 1 / 365) - 1;
  
  // Calculate compound interest over the period
  return amount * Math.pow(1 + dailyRate, durationDays) - amount;
}

/**
 * Get a list of supported chains in OrbitYield
 * @returns Array of supported chains with their details
 */
export function getSupportedChains(): Array<{id: string, name: string, isTestnet: boolean}> {
  return [
    { id: 'og-galileo', name: '0G Galileo Testnet', isTestnet: true },
  ];
}
