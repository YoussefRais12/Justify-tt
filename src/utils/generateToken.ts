import crypto from 'crypto';

export function generateToken(email: string): string {
  console.log(`Generating token for email: ${email}`);
  const token = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');
  console.log(`Generated token: ${token}`);
  return token;
}
