"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const crypto_1 = __importDefault(require("crypto"));
function generateToken(email) {
    console.log(`Generating token for email: ${email}`);
    const token = crypto_1.default.createHash('sha256').update(email + Date.now().toString()).digest('hex');
    console.log(`Generated token: ${token}`);
    return token;
}
