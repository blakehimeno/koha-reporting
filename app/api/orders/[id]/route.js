import { getConnection } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT
          ElectronicCode,
          ConfirmationNumber,
          CustomerCode,
          OrderDate,
          DeliveryDate,
          ProductCode,
          OrderQuantity,
          UnitOfMeasure_SellBy,
          OverridePrice,
          ElectronicStatus,
          Customer_PO,
          ScheduledShipDate,
          ProductWarehouse,
          RejectInfo
        FROM OE_ElectronicOrders
        WHERE ConfirmationNumber = @id
        ORDER BY ElectronicCode ASC
      `);
    return Response.json(result.recordset);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}