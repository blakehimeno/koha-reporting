require('dotenv').config({ path: '.env.local' });
const { getConnection } = require('./lib/db');

async function test() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 10
        ConfirmationNumber,
        COUNT(*) as LineCount,
        SUM(OrderQuantity * OverridePrice) as OrderTotal
      FROM OE_ElectronicOrders
      GROUP BY ConfirmationNumber
      ORDER BY ConfirmationNumber DESC
    `);
    console.log(result.recordset);
  } catch (err) {
    console.error('Failed:', err);
  }
}

test();