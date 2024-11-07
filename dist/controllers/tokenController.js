"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenController = generateTokenController;
const generateToken_1 = require("../utils/generateToken");
const rateLimit_1 = require("../middlewares/rateLimit");
function generateTokenController(req, res) {
    const { email } = req.body;
    console.log(`Request received to generate token for email: ${email}`);
    if (!email) {
        console.log('Email not provided');
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    const token = (0, generateToken_1.generateToken)(email);
    rateLimit_1.tokenWordCount[token] = {
        count: 0,
        date: new Date().toISOString().slice(0, 10) // Set today's date in YYYY-MM-DD format
    };
    console.log("Token stored in tokenWordCount after generation:", rateLimit_1.tokenWordCount);
    res.json({ token });
}
