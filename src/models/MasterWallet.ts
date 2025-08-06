interface MasterWalletData {
  name: string;
  address: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

class MasterWallet {
  public _id?: string;
  public name: string;
  public address: string;
  public metadata: Record<string, any>;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: MasterWalletData) {
    this.name = data.name;
    this.address = data.address;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save(): Promise<MasterWallet> {
    // This would typically save to a database
    // For now, we'll just return the instance
    return this;
  }
}

export default MasterWallet; 