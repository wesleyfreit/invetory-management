import { SaleOrder } from '../../enterprise/entities/sale-order';

export abstract class SaleOrdersRepository {
  abstract create(order: SaleOrder): Promise<void>;
  abstract findById(orderId: string): Promise<SaleOrder | null>;
  abstract findAll(): Promise<SaleOrder[]>;
  abstract delete(order: SaleOrder): Promise<void>;
  abstract save(order: SaleOrder): Promise<void>;
}
