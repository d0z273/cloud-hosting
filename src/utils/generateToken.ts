import jwt from 'jsonwebtoken';
import { JWTPayload } from './types';
import { serialize } from 'cookie';

// GENERATE JWT TOKEN
export function generateJWT(jwtPayload: JWTPayload): string {
  const privateKey = process.env.JWT_SECRET as string;

  const token = jwt.sign(jwtPayload, privateKey, {
    expiresIn: '30d',
  });

  return token;
}

// SET COOKIE WITH JWT
export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateJWT(jwtPayload);

  const cookie = serialize('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return cookie;
}
