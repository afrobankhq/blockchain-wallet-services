import { ethers } from 'ethers';
import { TOKENS, getTokensByNetwork, getTokenBySymbol, TokenConfig } from '../config/tokens';

export class TokenService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const networks = {
      'base': process.env.BASE_RPC_URL!,
      'base-sepolia': process.env.BASE_TESTNET_RPC_URL!
    };

    for (const [network, rpcUrl] of Object.entries(networks)) {
      if (rpcUrl) {
        this.providers.set(network, new ethers.JsonRpcProvider(rpcUrl));
      }
    }
  }

  private getProvider(network: string): ethers.JsonRpcProvider {
    const provider = this.providers.get(network);
    if (!provider) {
      throw new Error(`No provider configured for network: ${network}`);
    }
    return provider;
  }

  async getTokenBalance(address: string, tokenSymbol: string, network: string): Promise<string> {
    const token = getTokenBySymbol(tokenSymbol, network);
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    const provider = this.getProvider(network);

    if (token.isNative) {
      // For native tokens like ETH
      const balance = await provider.getBalance(address);
      return balance.toString();
    } else {
      // For ERC-20 tokens
      const contract = new ethers.Contract(token.address, token.abi!, provider);
      const balance = await contract.balanceOf(address);
      return balance.toString();
    }
  }

  async getAllTokenBalances(address: string, network: string): Promise<Record<string, string>> {
    const tokens = getTokensByNetwork(network);
    const balances: Record<string, string> = {};

    for (const token of tokens) {
      try {
        balances[token.symbol.toLowerCase()] = await this.getTokenBalance(address, token.symbol, network);
      } catch (error) {
        console.error(`Error fetching balance for ${token.symbol}:`, error);
        balances[token.symbol.toLowerCase()] = '0';
      }
    }

    return balances;
  }

  async validateToken(tokenSymbol: string, network: string): Promise<boolean> {
    const token = getTokenBySymbol(tokenSymbol, network);
    return !!token;
  }

  getSupportedTokens(network: string): TokenConfig[] {
    return getTokensByNetwork(network);
  }

  async estimateGasForTransfer(
    fromAddress: string,
    toAddress: string,
    tokenSymbol: string,
    network: string,
    amount: string
  ): Promise<string> {
    const token = getTokenBySymbol(tokenSymbol, network);
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    const provider = this.getProvider(network);

    if (token.isNative) {
      // For native ETH transfers
      const tx = {
        from: fromAddress,
        to: toAddress,
        value: ethers.parseEther(amount)
      };
      return (await provider.estimateGas(tx)).toString();
    } else {
      // For ERC-20 transfers
      const contract = new ethers.Contract(token.address, [
        'function transfer(address to, uint256 amount) returns (bool)'
      ], provider);
      
      const parsedAmount = ethers.parseUnits(amount, token.decimals);
      return (await contract.transfer.estimateGas(toAddress, parsedAmount)).toString();
    }
  }

  async getTokenInfo(tokenSymbol: string, network: string): Promise<TokenConfig | null> {
    return getTokenBySymbol(tokenSymbol, network) || null;
  }

  formatTokenAmount(amount: string, tokenSymbol: string, network: string): string {
    const token = getTokenBySymbol(tokenSymbol, network);
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    try {
      const parsedAmount = ethers.parseUnits(amount, token.decimals);
      return ethers.formatUnits(parsedAmount, token.decimals);
    } catch (error) {
      throw new Error(`Invalid amount format for token ${tokenSymbol}`);
    }
  }

  async getNetworkStatus(network: string): Promise<boolean> {
    try {
      const provider = this.getProvider(network);
      await provider.getBlockNumber();
      return true;
    } catch (error) {
      console.error(`Network ${network} is not accessible:`, error);
      return false;
    }
  }
}

export const tokenService = new TokenService(); 