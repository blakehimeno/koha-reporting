import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
export const SESSION_COOKIE = 'session';

export async function createSessionToken(userId, username) {
  return await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}