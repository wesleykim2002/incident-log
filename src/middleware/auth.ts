import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized – No token provided' });
    return;
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('Firebase auth error:', err);
    res.status(401).json({ error: 'Unauthorized – Invalid token' });
  }
}
