import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionHistory } from '@/app/portfolio/components/TransactionHistory';
import { useYieldContracts } from '@/hooks/useYieldContracts';
import '@testing-library/jest-dom';

// Mock the useYieldContracts hook
jest.mock('@/hooks/useYieldContracts', () => ({
  useYieldContracts: jest.fn()
}));

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen
});

// Mock Mantle block explorer URL
jest.mock('@/lib/constants', () => ({
  BLOCK_EXPLORER_URLS: {
    mantle: 'https://explorer.mantle.xyz'
  }
}));

describe('Mantle TransactionHistory', () => {
  const mockMantleTransactions = [
    {
      id: 'mantle-1',
      type: 'deposit',
      timestamp: Math.floor(Date.now() / 1000) - 604800, // 7 days ago
      asset: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      assetSymbol: 'MNT',
      amount: '100000000000000000000', // 100 MNT
      strategy: '0x1234567890123456789012345678901234567891',
      strategyType: 'liquidity',
      protocolName: 'Agni Finance',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      chain: 'mantle',
      gasSponsored: true, // Pimlico integration
      gasSaved: '0.0005' // ETH
    },
    {
      id: 'mantle-2',
      type: 'withdraw',
      timestamp: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
      asset: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      assetSymbol: 'USDC',
      amount: '50000000', // 50 USDC (6 decimals)
      strategy: '0x1234567890123456789012345678901234567892',
      strategyType: 'lending',
      protocolName: 'FusionX',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567891',
      chain: 'mantle',
      oracle: 'chainlink' // Chainlink integration
    },
    {
      id: 'mantle-3',
      type: 'cross-chain',
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      asset: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      assetSymbol: 'USDC',
      amount: '10000000', // 10 USDC
      strategy: '0x1234567890123456789012345678901234567893',
      strategyType: 'bridge',
      protocolName: 'Orb Bridge',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567892',
      chain: 'mantle',
      bridge: 'orb' // Orb Labs integration
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve({ 
          success: true, 
          transactions: mockMantleTransactions,
          gasSavings: '0.0015' // Total gas saved
        })
      })
    );
  });

  it('displays Mantle-specific transactions', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000 // Mantle chainId
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
      // Check Mantle-specific assets
      expect(screen.getByText('MNT')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
      // Check Mantle protocols
      expect(screen.getByText('Agni Finance')).toBeInTheDocument();
      expect(screen.getByText('FusionX')).toBeInTheDocument();
      // Check sponsor indicators
      expect(screen.getByText(/sponsored/i)).toBeInTheDocument();
      expect(screen.getByText(/cross-chain/i)).toBeInTheDocument();
    });
  });

  it('shows gas savings for sponsored transactions', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total gas saved/i)).toBeInTheDocument();
      expect(screen.getByText(/0.0015 ETH/i)).toBeInTheDocument();
      expect(screen.getAllByText(/0.0005 ETH/i)[0]).toBeInTheDocument();
    });
  });

  it('opens Mantle block explorer for transactions', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('View');
      fireEvent.click(viewButtons[0]);
      expect(mockOpen).toHaveBeenCalledWith(
        `https://explorer.mantle.xyz/tx/${mockMantleTransactions[0].transactionHash}`,
        '_blank'
      );
    });
  });

  it('filters transactions by sponsor type', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      const filterButton = screen.getByText('Sponsored');
      fireEvent.click(filterButton);
      
      // Only sponsored transactions should remain
      expect(screen.getByText('Agni Finance')).toBeInTheDocument();
      expect(screen.queryByText('FusionX')).not.toBeInTheDocument();
      expect(screen.queryByText('Orb Bridge')).not.toBeInTheDocument();
    });
  });

  it('displays cross-chain transactions with Orb integration', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('Orb Bridge')).toBeInTheDocument();
      expect(screen.getByTestId('orb-badge')).toBeInTheDocument();
    });
  });

  it('shows Chainlink-secured transactions', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 5000
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      expect(screen.getByTestId('chainlink-badge')).toBeInTheDocument();
      expect(screen.getByText('FusionX')).toBeInTheDocument();
    });
  });

  it('handles network switching between Mantle and Ethereum', async () => {
    const mockSwitchNetwork = jest.fn();
    
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 1, // Ethereum
      switchNetwork: mockSwitchNetwork
    });

    render(<TransactionHistory />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Switch to Mantle/i));
      expect(mockSwitchNetwork).toHaveBeenCalledWith(5000);
    });
  });
});