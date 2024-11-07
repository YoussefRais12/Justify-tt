"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyTextController = justifyTextController;
const justifyText_1 = require("../utils/justifyText");
function justifyTextController(req, res) {
    console.log('Justifying text...');
    const text = req.body.text;
    if (!text) {
        console.log('No text provided');
        res.status(400).json({ error: 'Text is required' });
        return;
    }
    const justifiedText = (0, justifyText_1.justifyText)(text);
    console.log('Text justified successfully');
    res.setHeader('Content-Type', 'text/plain');
    res.send(justifiedText);
}
