import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3307"),
  user: process.env.DB_USER || "garage_user",
  password: process.env.DB_PASSWORD || "garage_password",
  database: process.env.DB_NAME || "code_garage_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
};

// Extend global type for TypeScript
declare global {
  var _pool: mysql.Pool | undefined;
}

// Prevent multiple pool instances in Next.js hot reload (dev mode)
if (!global._pool) {
  global._pool = mysql.createPool(dbConfig);
}

const pool: mysql.Pool = global._pool;

export async function query(sql: string, params: unknown[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database query error:", error.message);
    }
    throw error;
  }
}

export default pool;