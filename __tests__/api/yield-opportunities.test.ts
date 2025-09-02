import { NextRequest } from 'next/server';
import { GET } from '@/app/api/yield/opportunities/route';
import { YieldOptimizer } from '@/lib/yield/yield-optimizer';

// Mock the YieldOptimizer class with Mantle-specific opportunities
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/yield/opportunities/route';
import { YieldOptimizer } from '@/lib/yield/yield-optimizer';

// Mock the YieldOptimizer class with 0G-specific opportunities
jest.mock('@/lib/yield/yield-optimizer', () => {
  return {
    YieldOptimizer: jest.fn().mockImplementation(() => {
      return {
        discoverOpportunities: jest.fn().mockResolvedValue([
          {
            id: '0g-1',
            strategyAddress: '0x123',
            assetAddress: '0xabc',
            assetSymbol: 'OG',
            protocolName: '0G Protocol',
            strategyType: 'staking',
            apy: 1800, // 18%
            risk: 4,
            tvl: '5000000000000000000000', // 5000 OG
            minDeposit: '1000000000000000000', // 1 OG
            lockupPeriod: 0,
            chain: '0g-galileo-testnet',
            sponsoredGas: true // Pimlico integration
          },
          {
            id: '0g-2',
            strategyAddress: '0x456',
            assetAddress: '0xdef',
            assetSymbol: 'USDC',
            protocolName: '0G Protocol',
            strategyType: 'lending',
            apy: 950, // 9.5%
            risk: 2,
            tvl: '2000000000000', // 2000 USDC (6 decimals)
            minDeposit: '1000000', // 1 USDC
            lockupPeriod: 0,
            chain: '0g-galileo-testnet',
            oracle: 'chainlink' // Chainlink integration
          },
          {
            id: '0g-3',
            strategyAddress: '0x789',
            assetAddress: '0xghi',
            assetSymbol: 'ETH',
            protocolName: '0G Protocol',
            strategyType: 'cross-chain',
            apy: 1500, // 15%
            risk: 5,
            tvl: '1000000000000000000', // 1 ETH
            minDeposit: '10000000000000000', // 0.01 ETH
            lockupPeriod: 86400,
            chain: '0g-galileo-testnet',
            bridge: 'orb' // Orb Labs integration
          }
        ])
      };
    })
  };
});

// Mock ethers with 0G provider
jest.mock('ethers', () => {
  return {
    ethers: {
      providers: {
        JsonRpcProvider: jest.fn().mockImplementation(() => ({
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 80087, // 0G Galileo Testnet chainId
            name: '0g-galileo-testnet'
          }),
          getGasPrice: jest.fn().mockResolvedValue('100000000') // 0.1 gwei
        })),
        Web3Provider: jest.fn()
      },
      Contract: jest.fn()
    }
  };
});

describe('0G Yield Opportunities API', () => {
  const createMockRequest = (searchParams = {}) => {
    const url = new URL('https://example.com/api/yield/opportunities');
    
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
    
    return {
      nextUrl: url
    } as unknown as NextRequest;
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return 0G opportunities by default', async () => {
    const req = createMockRequest();
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(3);
    expect(data.data.every((op: any) => op.chain === '0g-galileo-testnet')).toBe(true);
  });
  
  it('should filter by sponsored gas opportunities (Pimlico)', async () => {
    const req = createMockRequest({ sponsoredGas: 'true' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].sponsoredGas).toBe(true);
    expect(data.data[0].protocolName).toBe('0G Protocol');
  });
  
  it('should filter by Chainlink oracle opportunities', async () => {
    const req = createMockRequest({ hasOracle: 'chainlink' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].oracle).toBe('chainlink');
    expect(data.data[0].protocolName).toBe('0G Protocol');
  });
  
  it('should filter by Orb cross-chain opportunities', async () => {
    const req = createMockRequest({ bridge: 'orb' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].bridge).toBe('orb');
  });
  
  it('should combine 0G-specific filters', async () => {
    const req = createMockRequest({ 
      minApy: '10',
      maxRisk: '5',
      chain: '0g-galileo-testnet'
    });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(2);
    expect(data.data[0].apy).toBeGreaterThanOrEqual(1000);
    expect(data.data[0].risk).toBeLessThanOrEqual(5);
  });
});

// Mock ethers with Mantle provider
jest.mock('ethers', () => {
  return {
    ethers: {
      providers: {
        JsonRpcProvider: jest.fn().mockImplementation(() => ({
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 5000, // Mantle testnet chainId
            name: 'mantle'
          }),
          getGasPrice: jest.fn().mockResolvedValue('100000000') // 0.1 gwei
        })),
        Web3Provider: jest.fn()
      },
      Contract: jest.fn()
    }
  };
});

describe('Mantle Yield Opportunities API', () => {
  const createMockRequest = (searchParams = {}) => {
    const url = new URL('https://example.com/api/yield/opportunities');
    
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
    
    return {
      nextUrl: url
    } as unknown as NextRequest;
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return Mantle opportunities by default', async () => {
    const req = createMockRequest();
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(3);
    expect(data.data.every((op: any) => op.chain === 'mantle')).toBe(true);
  });
  
  it('should filter by sponsored gas opportunities (Pimlico)', async () => {
    const req = createMockRequest({ sponsoredGas: 'true' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].sponsoredGas).toBe(true);
    expect(data.data[0].protocolName).toBe('Agni Finance');
  });
  
  it('should filter by Chainlink oracle opportunities', async () => {
    const req = createMockRequest({ hasOracle: 'chainlink' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].oracle).toBe('chainlink');
    expect(data.data[0].protocolName).toBe('FusionX');
  });
  
  it('should filter by Orb cross-chain opportunities', async () => {
    const req = createMockRequest({ bridge: 'orb' });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].bridge).toBe('orb');
  });
  
  it('should combine Mantle-specific filters', async () => {
    const req = createMockRequest({ 
      minApy: '10',
      maxRisk: '5',
      chain: 'mantle'
    });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(2); // Agni (18%) and Compound (15%)
    expect(data.data[0].apy).toBeGreaterThanOrEqual(1000);
    expect(data.data[0].risk).toBeLessThanOrEqual(5);
  });
});