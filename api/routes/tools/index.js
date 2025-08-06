"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToolRoutes = void 0;
const createMasterWallet_1 = require("./createMasterWallet");
const registerToolRoutes = (app) => {
    app.post('/tools/create_master_wallet', createMasterWallet_1.createMasterWalletHandler);
    // Add more tool routes here...
};
exports.registerToolRoutes = registerToolRoutes;
