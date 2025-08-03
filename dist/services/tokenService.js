"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = exports.TokenService = void 0;
const ethers_1 = require("ethers");
const tokens_1 = require("../config/tokens");
class TokenService {
    constructor() {
        this.providers = new Map();
        this.initializeProviders();
    }
    initializeProviders() {
        const networks = {
            'base': process.env.BASE_RPC_URL,
            'base-sepolia': process.env.BASE_TESTNET_RPC_URL,
            'ethereum-sepolia': process.env.ETHEREUM_SEPOLIA_RPC_URL
        };
        for (const [network, rpcUrl] of Object.entries(networks)) {
            if (rpcUrl) {
                this.providers.set(network, new ethers_1.ethers.JsonRpcProvider(rpcUrl));
            }
        }
    }
    getProvider(network) {
        const provider = this.providers.get(network);
        if (!provider) {
            throw new Error(`No provider configured for network: ${network}`);
        }
        return provider;
    }
    async getTokenBalance(address, tokenSymbol, network) {
        const token = (0, tokens_1.getTokenBySymbol)(tokenSymbol, network);
        if (!token) {
            throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
        }
        const provider = this.getProvider(network);
        if (token.isNative) {
            // For native tokens like ETH
            const balance = await provider.getBalance(address);
            return balance.toString();
        }
        else {
            // For ERC-20 tokens
            const contract = new ethers_1.ethers.Contract(token.address, token.abi, provider);
            const balance = await contract.balanceOf(address);
            return balance.toString();
        }
    }
    async getAllTokenBalances(address, network) {
        const tokens = (0, tokens_1.getTokensByNetwork)(network);
        const balances = {};
        for (const token of tokens) {
            try {
                balances[token.symbol.toLowerCase()] = await this.getTokenBalance(address, token.symbol, network);
            }
            catch (error) {
                console.error(`Error fetching balance for ${token.symbol}:`, error);
                balances[token.symbol.toLowerCase()] = '0';
            }
        }
        return balances;
    }
    async validateToken(tokenSymbol, network) {
        const token = (0, tokens_1.getTokenBySymbol)(tokenSymbol, network);
        return !!token;
    }
    getSupportedTokens(network) {
        return (0, tokens_1.getTokensByNetwork)(network);
    }
    async estimateGasForTransfer(fromAddress, toAddress, tokenSymbol, network, amount) {
        const token = (0, tokens_1.getTokenBySymbol)(tokenSymbol, network);
        if (!token) {
            throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
        }
        const provider = this.getProvider(network);
        if (token.isNative) {
            // For native ETH transfers
            const tx = {
                from: fromAddress,
                to: toAddress,
                value: ethers_1.ethers.parseEther(amount)
            };
            return (await provider.estimateGas(tx)).toString();
        }
        else {
            // For ERC-20 transfers
            const contract = new ethers_1.ethers.Contract(token.address, [
                'function transfer(address to, uint256 amount) returns (bool)'
            ], provider);
            const parsedAmount = ethers_1.ethers.parseUnits(amount, token.decimals);
            return (await contract.transfer.estimateGas(toAddress, parsedAmount)).toString();
        }
    }
    async getTokenInfo(tokenSymbol, network) {
        return (0, tokens_1.getTokenBySymbol)(tokenSymbol, network) || null;
    }
    formatTokenAmount(amount, tokenSymbol, network) {
        const token = (0, tokens_1.getTokenBySymbol)(tokenSymbol, network);
        if (!token) {
            throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
        }
        try {
            const parsedAmount = ethers_1.ethers.parseUnits(amount, token.decimals);
            return ethers_1.ethers.formatUnits(parsedAmount, token.decimals);
        }
        catch (error) {
            throw new Error(`Invalid amount format for token ${tokenSymbol}`);
        }
    }
    async getNetworkStatus(network) {
        try {
            const provider = this.getProvider(network);
            await provider.getBlockNumber();
            return true;
        }
        catch (error) {
            console.error(`Network ${network} is not accessible:`, error);
            return false;
        }
    }
}
exports.TokenService = TokenService;
exports.tokenService = new TokenService();
