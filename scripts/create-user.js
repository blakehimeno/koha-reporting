const bcrypt = require('bcryptjs');
const db = require('../lib/users-db');

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: node scripts/create-user.js <username> <password>');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);

  console.log(`User "${username}" created.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});