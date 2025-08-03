import { Request, Response } from 'express';
import { masterWalletService, dedicatedAddressService } from '../../services/firebaseService';

export const createMasterWallet = async (req: Request, res: Response) => {
  try {
    const { name, metadata } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const masterWallet = await masterWalletService.create({ name, metadata });
    
    res.json({
      success: true,
      data: {
        id: masterWallet.id,
        name: masterWallet.name,
        address: masterWallet.address,
        metadata: masterWallet.metadata,
        createdAt: masterWallet.createdAt,
      }
    });
  } catch (error: any) {
    console.error('Error creating master wallet:', error);
    res.status(500).json({ 
      error: 'Failed to create master wallet', 
      message: error.message 
    });
  }
};

export const createDedicatedAddress = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      master_wallet_id,
      name,
      disable_auto_sweep,
      enable_gasless_withdraw,
      metadata,
    } = req.body;

    if (!customer_id || !master_wallet_id) {
      return res.status(400).json({ 
        error: 'customer_id and master_wallet_id are required' 
      });
    }

    // Verify master wallet exists
    const masterWallet = await masterWalletService.findById(master_wallet_id);
    if (!masterWallet) {
      return res.status(404).json({ error: 'Master wallet not found' });
    }

    const dedicatedAddress = await dedicatedAddressService.create({
      customer_id,
      master_wallet_id,
      name,
      disable_auto_sweep,
      enable_gasless_withdraw,
      metadata,
    });

    res.json({
      success: true,
      data: {
        id: dedicatedAddress.id,
        customer_id: dedicatedAddress.customer_id,
        master_wallet_id: dedicatedAddress.master_wallet_id,
        address: dedicatedAddress.address,
        name: dedicatedAddress.name,
        disable_auto_sweep: dedicatedAddress.disable_auto_sweep,
        enable_gasless_withdraw: dedicatedAddress.enable_gasless_withdraw,
        metadata: dedicatedAddress.metadata,
        is_active: dedicatedAddress.is_active,
        createdAt: dedicatedAddress.createdAt,
      }
    });
  } catch (error: any) {
    console.error('Error creating dedicated address:', error);
    res.status(500).json({ 
      error: 'Failed to create dedicated address', 
      message: error.message 
    });
  }
};
