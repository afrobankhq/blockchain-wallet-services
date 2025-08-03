"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNativeToken = exports.getTokenBySymbol = exports.getTokensByNetwork = exports.TOKENS = void 0;
exports.TOKENS = {
    // Base Mainnet Tokens
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        network: 'base',
        abi: ['function balanceOf(address) view returns (uint256)']
    },
    USDT: {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
        decimals: 6,
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
    'USDT-SEPOLIA': {
        symbol: 'USDT',
        name: 'Tether USD (Sepolia)',
        address: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2',
        decimals: 6,
        network: 'base-sepolia',
        abi: ['function balanceOf(address) view returns (uint256)']
    },
    // Ethereum Sepolia Testnet Tokens
    ETH: {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '0x0000000000000000000000000000000000000000', // Native token
        decimals: 18,
        network: 'ethereum-sepolia',
        isNative: true
    },
    'cNGN-SEPOLIA': {
        symbol: 'cNGN',
        name: 'Celo Naira (Sepolia)',
        address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // Example address
        decimals: 18,
        network: 'ethereum-sepolia',
        abi: ['function balanceOf(address) view returns (uint256)']
    },
    'lZAR-SEPOLIA': {
        symbol: 'lZAR',
        name: 'Local ZAR (Sepolia)',
        address: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // Example address
        decimals: 18,
        network: 'ethereum-sepolia',
        abi: ['function balanceOf(address) view returns (uint256)']
    }
};
const getTokensByNetwork = (network) => {
    return Object.values(exports.TOKENS).filter(token => token.network === network);
};
exports.getTokensByNetwork = getTokensByNetwork;
const getTokenBySymbol = (symbol, network) => {
    const tokens = network
        ? Object.values(exports.TOKENS).filter(token => token.network === network)
        : Object.values(exports.TOKENS);
    return tokens.find(token => token.symbol === symbol);
};
exports.getTokenBySymbol = getTokenBySymbol;
const getNativeToken = (network) => {
    return Object.values(exports.TOKENS).find(token => token.network === network && token.isNative);
};
exports.getNativeToken = getNativeToken;
