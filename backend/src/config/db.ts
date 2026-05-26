import dotenv from 'dotenv';
import sql from 'mssql';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serverEnv = process.env.DB_SERVER ?? 'localhost';
let serverHost = serverEnv;
let instanceName: string | undefined = undefined;

if (serverEnv.includes('\\')) {
  const parts = serverEnv.split('\\');
  serverHost = parts[0] === '.' ? 'localhost' : parts[0];
  instanceName = parts[1];
}

const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: serverHost,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: instanceName,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();
  }
  return pool;
}
