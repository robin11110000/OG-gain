import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Define the 0G Galileo Testnet
const ogGalileo = {
  id: 80087,
  name: '0G Galileo Testnet',
  nativeCurrency: {
    name: 'OG',
    symbol: 'OG',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_OG_GALILEO_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Chain Scan',
      url: 'https://chainscan-galileo.0g.ai',
    },
  },
  testnet: true,
};

// Configure client
export const config = createConfig({
  chains: [ogGalileo],
  transports: {
    [ogGalileo.id]: http(),
  },
  connectors: [
    injected(),
  ],
});
