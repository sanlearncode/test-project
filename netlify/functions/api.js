const { Client } = require("pg");

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT
    );
  `);

  try {
    if (event.httpMethod === "GET") {
      const result = await client.query("SELECT * FROM users ORDER BY id DESC");
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows),
      };
    }
    if (event.httpMethod === "POST") {
      const { name } = JSON.parse(event.body);

      if (!name) {
        return { statusCode: 400, body: "Thiếu tên" };
      }

      await client.query("INSERT INTO users(name) VALUES($1)", [name]);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Đã thêm" }),
      };
    }

    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body);

      await client.query("DELETE FROM users WHERE id=$1", [id]);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Đã xóa" }),
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  } finally {
    await client.end();
  }
};