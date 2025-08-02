"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUser = void 0;
const user_model_1 = require("../modules/users/user/user.model");
const wallet_model_1 = require("../modules/wallet/wallet.model");
const isValidUser = (receiver_phone, session) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield user_model_1.User.findOne({ phone: receiver_phone }).session(session);
    if (!isValid) {
        return false;
    }
    const walletInfo = yield wallet_model_1.Wallet.findById(isValid.wallet).session(session);
    if (!walletInfo) {
        return false;
    }
    return walletInfo;
});
exports.isValidUser = isValidUser;
