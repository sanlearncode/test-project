const { Client } = require("pg");

async function getClient() {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS names (
      id         SERIAL PRIMARY KEY,
      name       TEXT        NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  return client;
}

module.exports = { getClient };