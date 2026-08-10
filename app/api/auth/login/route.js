import bcrypt from 'bcryptjs';
import db from '../../../../lib/users-db';
import { createSessionToken, SESSION_COOKIE } from '../../../../lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();

  const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username);
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSessionToken(user.id, user.username);
  const response = Response.json({ ok: true });
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 8}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  );
  return response;
}