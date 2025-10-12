"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHelper = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptHelper {
    static async hashPassword(myPlaintextPassword, saltRounds) {
        try {
            const hash = await bcrypt_1.default.hash(myPlaintextPassword, saltRounds);
            return hash;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error hashing password");
        }
    }
    static async comparePassword(password, passwordHash) {
        if (!passwordHash)
            return false;
        try {
            return await bcrypt_1.default.compare(password, passwordHash);
        }
        catch (error) {
            console.error(error);
            throw new Error("Error comparing passwords");
        }
    }
}
exports.BcryptHelper = BcryptHelper;
