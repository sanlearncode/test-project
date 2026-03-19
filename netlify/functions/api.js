const { Client } = require("pg");

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  await client.connect();

  try {
    // Lấy danh sách
    if (event.httpMethod === "GET") {
      const result = await client.query("SELECT * FROM users ORDER BY id DESC");
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows),
      };
    }

    // Thêm
    if (event.httpMethod === "POST") {
      const { name } = JSON.parse(event.body);

      await client.query("INSERT INTO users(name) VALUES($1)", [name]);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Added" }),
      };
    }

    // Xóa
    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body);

      await client.query("DELETE FROM users WHERE id=$1", [id]);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Deleted" }),
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