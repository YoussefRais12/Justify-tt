import { Request, Response } from 'express';
import { justifyText } from '../utils/justifyText';

export function justifyTextController(req: Request, res: Response): void {
  console.log('Justifying text...');
  const text = req.body.text;
  if (!text) {
    console.log('No text provided');
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  const justifiedText = justifyText(text);
  console.log('Text justified successfully');
  res.setHeader('Content-Type', 'text/plain');
  res.send(justifiedText);
}
