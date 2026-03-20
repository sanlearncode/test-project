const { getClient } = require("./db");

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  const client = await getClient();
  try {
    const method = event.httpMethod;

    // Lấy :id từ path (nếu có)
    const segments = event.path.replace(/\/$/, "").split("/");
    const last = segments[segments.length - 1];
    const id = last !== "names" ? parseInt(last, 10) : null;

    // GET /names
    if (method === "GET" && !id) {
      const { rows } = await client.query(
        "SELECT id, name, created_at FROM names ORDER BY created_at DESC"
      );
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ names: rows }) };
    }

    // POST /names
    if (method === "POST" && !id) {
      const { name } = JSON.parse(event.body || "{}");
      if (!name || !name.trim()) {
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "name is required" }) };
      }
      const { rows } = await client.query(
        "INSERT INTO names (name) VALUES ($1) RETURNING *",
        [name.trim()]
      );
      return { statusCode: 201, headers: HEADERS, body: JSON.stringify({ name: rows[0] }) };
    }

    // DELETE /names/:id
    if (method === "DELETE" && id && !isNaN(id)) {
      const { rowCount } = await client.query(
        "DELETE FROM names WHERE id = $1", [id]
      );
      if (rowCount === 0) {
        return { statusCode: 404, headers: HEADERS, body: JSON.stringify({ error: "Not found" }) };
      }
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ deleted: true }) };
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: "Internal server error" }) };
  } finally {
    await client.end();
  }
};