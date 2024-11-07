"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const rateLimit_1 = require("./rateLimit");
function authenticateToken(req, res, next) {
    var _a;
    console.log('Authenticating token...');
    let token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.trim();
    // Check if the token starts with "Bearer " and strip it out if present
    if (token === null || token === void 0 ? void 0 : token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove "Bearer " prefix
    }
    console.log("Provided token:", token);
    console.log("Current tokens in tokenWordCount:", rateLimit_1.tokenWordCount);
    if (!token) {
        console.log('No token provided');
        res.status(401).json({ error: 'Token is required' });
        return;
    }
    if (!(token in rateLimit_1.tokenWordCount)) {
        console.log('Invalid or expired token');
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
    console.log('Token authenticated successfully');
    req.body.token = token;
    next();
}
