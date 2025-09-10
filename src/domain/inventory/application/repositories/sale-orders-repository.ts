import { SaleOrder } from '../../enterprise/entities/sale-order';
import { SalesHistory } from '../../enterprise/entities/value-objects/sales-history';
import { SalesTrend } from '../../enterprise/entities/value-objects/sales-trend';

export abstract class SaleOrdersRepository {
  abstract create(order: SaleOrder): Promise<void>;
  abstract findById(orderId: string): Promise<SaleOrder | null>;
  abstract findAll(): Promise<SaleOrder[]>;
  abstract delete(order: SaleOrder): Promise<void>;
  abstract save(order: SaleOrder): Promise<void>;
  abstract generateSalesHistoryByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<SalesHistory>;
  abstract analyzeSalesTrends(startDate: Date, endDate: Date): Promise<SalesTrend[]>;
}
