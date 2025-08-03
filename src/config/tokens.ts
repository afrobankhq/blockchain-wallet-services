export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  network: 'base' | 'base-sepolia';
  isNative?: boolean;
  abi?: string[];
}

export const TOKENS: Record<string, TokenConfig> = {
  // Base Mainnet Tokens
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    network: 'base',
    abi: ['function balanceOf(address) view returns (uint256)']
  },
  cNGN: {
    symbol: 'cNGN',
    name: 'Celo Naira',
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // Example address for Base mainnet
    decimals: 18,
    network: 'base',
    abi: ['function balanceOf(address) view returns (uint256)']
  },
  
  // Base Sepolia Testnet Tokens
  'USDC-SEPOLIA': {
    symbol: 'USDC',
    name: 'USD Coin (Sepolia)',
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7c',
    decimals: 6,
    network: 'base-sepolia',
    abi: ['function balanceOf(address) view returns (uint256)']
  },
  'cNGN-SEPOLIA': {
    symbol: 'cNGN',
    name: 'Celo Naira (Sepolia)',
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // Example address for Base Sepolia
    decimals: 18,
    network: 'base-sepolia',
    abi: ['function balanceOf(address) view returns (uint256)']
  }
};

export const getTokensByNetwork = (network: string): TokenConfig[] => {
  return Object.values(TOKENS).filter(token => token.network === network);
};

export const getTokenBySymbol = (symbol: string, network?: string): TokenConfig | undefined => {
  const tokens = network 
    ? Object.values(TOKENS).filter(token => token.network === network)
    : Object.values(TOKENS);
  
  return tokens.find(token => token.symbol === symbol);
};

export const getNativeToken = (network: string): TokenConfig | undefined => {
  return Object.values(TOKENS).find(token => 
    token.network === network && token.isNative
  );
}; 