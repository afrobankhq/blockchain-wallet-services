import { ethers } from 'ethers';
import MasterWallet from '../models/MasterWallet';

interface CreateWalletInput {
  name: string;
  metadata?: Record<string, any>;
}

export const createMasterWallet = async ({ name, metadata }: CreateWalletInput) => {
  const wallet = ethers.Wallet.createRandom();

  const newWallet = new MasterWallet({
    name,
    address: wallet.address,
    metadata: metadata || {}
  });

  await newWallet.save();

  return {
    wallet_id: newWallet._id,
    address: wallet.address
  };
};
