import { getFirestore } from '../config/firebase';
import { ethers } from 'ethers';

const db = getFirestore();

// Master Wallet operations
export const masterWalletService = {
  async create(data: { name: string; metadata?: any }) {
    const wallet = ethers.Wallet.createRandom();
    const masterWallet = {
      id: wallet.address, // Use address as ID for easy reference
      name: data.name,
      address: wallet.address,
      privateKey: wallet.privateKey, // Store encrypted in production
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('masterWallets').doc(wallet.address).set(masterWallet);
    return masterWallet;
  },

  async findById(id: string) {
    const doc = await db.collection('masterWallets').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findAll() {
    const snapshot = await db.collection('masterWallets').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id: string, updates: any) {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await db.collection('masterWallets').doc(id).update(updateData);
    return this.findById(id);
  },

  async delete(id: string) {
    await db.collection('masterWallets').doc(id).delete();
  },
};

// Dedicated Address operations
export const dedicatedAddressService = {
  async create(data: {
    customer_id: string;
    master_wallet_id: string;
    name?: string;
    disable_auto_sweep?: boolean;
    enable_gasless_withdraw?: boolean;
    metadata?: any;
  }) {
    const wallet = ethers.Wallet.createRandom();
    const dedicatedAddress = {
      id: wallet.address,
      customer_id: data.customer_id,
      master_wallet_id: data.master_wallet_id,
      address: wallet.address,
      privateKey: wallet.privateKey, // Store encrypted in production
      name: data.name || '',
      disable_auto_sweep: data.disable_auto_sweep || false,
      enable_gasless_withdraw: data.enable_gasless_withdraw || false,
      metadata: data.metadata || {},
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('dedicatedAddresses').doc(wallet.address).set(dedicatedAddress);
    return dedicatedAddress;
  },

  async findById(id: string) {
    const doc = await db.collection('dedicatedAddresses').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findByCustomerId(customer_id: string) {
    const snapshot = await db
      .collection('dedicatedAddresses')
      .where('customer_id', '==', customer_id)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findByMasterWalletId(master_wallet_id: string) {
    const snapshot = await db
      .collection('dedicatedAddresses')
      .where('master_wallet_id', '==', master_wallet_id)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findAll(filters: {
    customer_id?: string;
    master_wallet_id?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = db.collection('dedicatedAddresses');

    if (filters.customer_id) {
      query = query.where('customer_id', '==', filters.customer_id);
    }
    if (filters.master_wallet_id) {
      query = query.where('master_wallet_id', '==', filters.master_wallet_id);
    }
    if (filters.is_active !== undefined) {
      query = query.where('is_active', '==', filters.is_active);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id: string, updates: any) {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await db.collection('dedicatedAddresses').doc(id).update(updateData);
    return this.findById(id);
  },

  async delete(id: string) {
    await db.collection('dedicatedAddresses').doc(id).delete();
  },
};

// Transaction operations
export const transactionService = {
  async create(data: {
    tx_hash: string;
    from_address: string;
    to_address: string;
    amount: string;
    token_symbol?: string;
    network: string;
    status: string;
    metadata?: any;
  }) {
    const transaction = {
      id: data.tx_hash,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('transactions').doc(data.tx_hash).set(transaction);
    return transaction;
  },

  async findByHash(tx_hash: string) {
    const doc = await db.collection('transactions').doc(tx_hash).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findByAddress(address: string, network?: string) {
    let query = db.collection('transactions');
    
    // Query for transactions where address is either from or to
    const fromSnapshot = await query.where('from_address', '==', address).get();
    const toSnapshot = await query.where('to_address', '==', address).get();
    
    let transactions = [
      ...fromSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...toSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];

    // Filter by network if specified
    if (network) {
      transactions = transactions.filter(tx => tx.network === network);
    }

    return transactions;
  },

  async updateStatus(tx_hash: string, status: string) {
    await db.collection('transactions').doc(tx_hash).update({
      status,
      updatedAt: new Date(),
    });
    return this.findByHash(tx_hash);
  },
}; 