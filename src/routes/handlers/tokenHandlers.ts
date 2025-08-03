import { Request, Response } from 'express';
import { tokenService } from '../../services/tokenService';
import { getTokensByNetwork } from '../../config/tokens';

export const getSupportedTokens = async (req: Request, res: Response) => {
  try {
    const { network } = req.params;
    
    if (!network) {
      return res.status(400).json({ error: 'Network parameter is required' });
    }

    const tokens = getTokensByNetwork(network);
    
    res.json({
      network,
      tokens: tokens.map(token => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        isNative: token.isNative || false
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get supported tokens', message: err.message });
  }
};

export const getTokenInfo = async (req: Request, res: Response) => {
  try {
    const { symbol, network } = req.params;
    
    if (!symbol || !network) {
      return res.status(400).json({ error: 'Token symbol and network are required' });
    }

    const tokenInfo = await tokenService.getTokenInfo(symbol, network);
    
    if (!tokenInfo) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json({
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      address: tokenInfo.address,
      decimals: tokenInfo.decimals,
      network: tokenInfo.network,
      isNative: tokenInfo.isNative || false
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get token info', message: err.message });
  }
};

export const getNetworkStatus = async (req: Request, res: Response) => {
  try {
    const { network } = req.params;
    
    if (!network) {
      return res.status(400).json({ error: 'Network parameter is required' });
    }

    const isOnline = await tokenService.getNetworkStatus(network);
    
    res.json({
      network,
      status: isOnline ? 'online' : 'offline',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get network status', message: err.message });
  }
};

export const estimateGas = async (req: Request, res: Response) => {
  try {
    const { from_address, to_address, token_symbol, network, amount } = req.body;
    
    if (!from_address || !to_address || !token_symbol || !network || !amount) {
      return res.status(400).json({ 
        error: 'from_address, to_address, token_symbol, network, and amount are required' 
      });
    }

    const gasEstimate = await tokenService.estimateGasForTransfer(
      from_address,
      to_address,
      token_symbol,
      network,
      amount
    );

    res.json({
      from_address,
      to_address,
      token_symbol,
      network,
      amount,
      estimated_gas: gasEstimate
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to estimate gas', message: err.message });
  }
}; 