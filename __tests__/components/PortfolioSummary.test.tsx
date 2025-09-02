import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PortfolioSummary } from '@/app/portfolio/components/PortfolioSummary';
import { useYieldContracts } from '@/hooks/useYieldContracts';
import '@testing-library/jest-dom';

// Mock the useYieldContracts hook
jest.mock('@/hooks/useYieldContracts', () => ({
  useYieldContracts: jest.fn()
}));

// Mock the toast component
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock Pimlico's gas sponsorship
jest.mock('@/lib/gas-sponsor', () => ({
  useGasSponsorship: () => ({
    sponsorTransaction: jest.fn().mockResolvedValue({ sponsored: true, gasSaved: '0.0005' })
  })
}));

describe('Mantle PortfolioSummary', () => {
  const mockMantlePositions = [
    {
      strategy: '0x123',
      strategyType: 'liquidity',
      asset: '0xabc',
      assetSymbol: 'MNT',
      protocolName: 'Agni Finance',
      depositAmount: '2000000000000000000', // 2 MNT in wei
      depositValue: '2000000000000000000', // 2 MNT in wei
      depositTimestamp: Math.floor(Date.now() / 1000) - 3600 * 24 * 7, // 7 days ago
      apy: 1800, // 18%
      rewards: '180000000000000000', // 0.18 MNT in wei
      chain: 'mantle',
      sponsoredGas: true // Pimlico integration
    },
    {
      strategy: '0x456',
      strategyType: 'lending',
      asset: '0xdef',
      assetSymbol: 'USDC',
      protocolName: 'FusionX',
      depositAmount: '1000000', // 1 USDC (6 decimals)
      depositValue: '1000000', // 1 USDC in wei
      depositTimestamp: Math.floor(Date.now() / 1000) - 3600 * 24 * 3, // 3 days ago
      apy: 950, // 9.5%
      rewards: '95000', // 0.095 USDC in wei
      chain: 'mantle',
      oracle: 'chainlink' // Chainlink integration
    },
    {
      strategy: '0x789',
      strategyType: 'cross-chain',
      asset: '0xghi',
      assetSymbol: 'ETH',
      protocolName: 'Compound',
      depositAmount: '100000000000000000', // 0.1 ETH in wei
      depositValue: '200000000000000000', // 0.2 ETH in wei
      depositTimestamp: Math.floor(Date.now() / 1000) - 3600 * 24 * 5, // 5 days ago
      apy: 1500, // 15%
      rewards: '15000000000000000', // 0.015 ETH in wei
      chain: 'mantle',
      bridge: 'orb' // Orb Labs integration
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays Mantle-specific portfolio metrics', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      getUserPositions: jest.fn().mockResolvedValue(mockMantlePositions),
      withdraw: jest.fn().mockResolvedValue({ hash: '0x123' }),
      claimRewards: jest.fn().mockResolvedValue({ hash: '0x456' }),
      getGasSavings: jest.fn().mockResolvedValue('0.0005') // ETH saved
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total portfolio value/i)).toBeInTheDocument();
      // Check Mantle-specific assets
      expect(screen.getByText('MNT')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
      // Check Mantle protocols
      expect(screen.getByText('Agni Finance')).toBeInTheDocument();
      expect(screen.getByText('FusionX')).toBeInTheDocument();
      // Check sponsor indicators
      expect(screen.getByText(/sponsored gas/i)).toBeInTheDocument();
      expect(screen.getByText(/chainlink secured/i)).toBeInTheDocument();
    });
  });

  it('shows gas savings for Mantle transactions', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      getUserPositions: jest.fn().mockResolvedValue(mockMantlePositions),
      getGasSavings: jest.fn().mockResolvedValue('0.0005')
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      expect(screen.getByText(/Gas saved/i)).toBeInTheDocument();
      expect(screen.getByText(/0.0005 ETH/i)).toBeInTheDocument();
    });
  });

  it('handles cross-chain withdrawals with Orb integration', async () => {
    const mockWithdraw = jest.fn().mockResolvedValue({ hash: '0x789' });
    
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      getUserPositions: jest.fn().mockResolvedValue(mockMantlePositions),
      withdraw: mockWithdraw
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      const ethWithdrawButtons = screen.getAllByText(/withdraw/i);
      // ETH position is the third one (index 2)
      fireEvent.click(ethWithdrawButtons[2]);
    });

    await waitFor(() => {
      expect(mockWithdraw).toHaveBeenCalledWith(
        '0x789', // strategy
        '0xghi', // asset
        '100000000000000000', // amount
        { bridge: 'orb' } // Orb Labs integration
      );
    });
  });

  it('displays sponsor badges for integrated protocols', async () => {
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      getUserPositions: jest.fn().mockResolvedValue(mockMantlePositions)
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      // Pimlico badge
      expect(screen.getByTestId('pimlico-badge')).toBeInTheDocument();
      // Chainlink badge
      expect(screen.getByTestId('chainlink-badge')).toBeInTheDocument();
      // Orb badge
      expect(screen.getByTestId('orb-badge')).toBeInTheDocument();
    });
  });

  it('optimizes transactions with Pimlico sponsorship', async () => {
    const mockWithdraw = jest.fn().mockResolvedValue({ hash: '0x123', sponsored: true });
    
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      getUserPositions: jest.fn().mockResolvedValue(mockMantlePositions),
      withdraw: mockWithdraw,
      isSponsored: true
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      const withdrawButtons = screen.getAllByText(/withdraw/i);
      fireEvent.click(withdrawButtons[0]); // Agni position with sponsored gas
    });

    await waitFor(() => {
      expect(mockWithdraw).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        { useSponsored: true } // Pimlico flag
      );
      expect(screen.getByText(/Transaction sponsored/i)).toBeInTheDocument();
    });
  });

  it('handles Mantle network switching', async () => {
    const mockSwitchNetwork = jest.fn().mockResolvedValue(true);
    
    (useYieldContracts as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x123',
      chainId: 1, // Ethereum mainnet
      switchNetwork: mockSwitchNetwork,
      getUserPositions: jest.fn().mockResolvedValue([])
    });

    render(<PortfolioSummary />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Switch to Mantle/i));
      expect(mockSwitchNetwork).toHaveBeenCalledWith(5000); // Mantle chainId
    });
  });
});