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

declare global {
  var _pool: mysql.Pool | undefined;
}

if (!global._pool) {
  global._pool = mysql.createPool(dbConfig);
}

const pool: mysql.Pool = global._pool;

/**
 * Normal query (non-transactional)
 * Used everywhere else in the app
 */
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

/**
 * Transaction helper
 * Guarantees ALL queries succeed or NONE do
 */
export async function withTransaction<T>(
  fn: (tx: (sql: string, params?: unknown[]) => Promise<any>) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const tx = async (sql: string, params: unknown[] = []) => {
      const [results] = await connection.execute(sql, params);
      return results;
    };

    const result = await fn(tx);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction rolled back:", error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
