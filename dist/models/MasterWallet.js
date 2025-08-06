"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MasterWallet {
    constructor(data) {
        this.name = data.name;
        this.address = data.address;
        this.metadata = data.metadata || {};
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }
    async save() {
        // This would typically save to a database
        // For now, we'll just return the instance
        return this;
    }
}
exports.default = MasterWallet;
