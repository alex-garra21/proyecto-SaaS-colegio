import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function main() {
  try {
    console.log('Connecting to:', dbConfig.database);
    const pool = await sql.connect(dbConfig);
    
    console.log('\n--- TABLES ---');
    const tablesRes = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    console.log(tablesRes.recordset.map(t => t.TABLE_NAME));

    console.log('\n--- COLUMNS FOR SeccionV2 ---');
    const colsSeccion = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'SeccionV2'
    `);
    console.log(colsSeccion.recordset);

    console.log('\n--- COLUMNS FOR PeriodoHorario ---');
    const colsPeriodo = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'PeriodoHorario'
    `);
    console.log(colsPeriodo.recordset);

    console.log('\n--- COLUMNS FOR HorarioClase ---');
    const colsHorario = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'HorarioClase'
    `);
    console.log(colsHorario.recordset);

    await pool.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
