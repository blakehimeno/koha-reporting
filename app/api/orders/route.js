import { getConnection } from '../../../lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 50
        ConfirmationNumber,
        CustomerCode,
        MIN(OrderDate) as OrderDate,
        MIN(DeliveryDate) as DeliveryDate,
        COUNT(*) as LineCount,
        SUM(OrderQuantity * OverridePrice) as OrderTotal,
        MAX(ElectronicStatus) as ElectronicStatus
      FROM OE_ElectronicOrders
      GROUP BY ConfirmationNumber, CustomerCode
      ORDER BY ConfirmationNumber DESC
    `);
    return Response.json(result.recordset);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}