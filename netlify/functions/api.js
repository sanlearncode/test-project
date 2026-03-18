exports.handler = async (event) => {
  const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  console.log("URL:", SUPABASE_DATABASE_URL);
  console.log("KEY:", SUPABASE_ANON_KEY ? "OK" : "MISSING");

  try {
    if (event.httpMethod === "GET") {
      const res = await fetch(`${SUPABASE_DATABASE_URL}/rest/v1/users`, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const data = await res.json();

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === "POST") {
      const { name } = JSON.parse(event.body);

      const res = await fetch(`${SUPABASE_DATABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };

  } catch (err) {
    console.error("ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};