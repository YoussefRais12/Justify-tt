"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const tokenController_1 = require("./controllers/tokenController");
const justifyController_1 = require("./controllers/justifyController");
const authenticateToken_1 = require("./middlewares/authenticateToken");
const rateLimit_1 = require("./middlewares/rateLimit");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Serve static files from the public folder
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Define routes
app.post('/api/token', tokenController_1.generateTokenController);
app.post('/api/justify', authenticateToken_1.authenticateToken, rateLimit_1.rateLimit, justifyController_1.justifyTextController);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
