import { PurchaseOrder } from '../../enterprise/entities/purchase-order';

export abstract class PurchaseOrdersRepository {
  abstract create(order: PurchaseOrder): Promise<void>;
  abstract createPurchaseOrderByTrends(
    startDate: Date,
    endDate: Date,
  ): Promise<PurchaseOrder>;
  abstract findById(orderId: string): Promise<PurchaseOrder | null>;
  abstract findAll(): Promise<PurchaseOrder[]>;
  abstract save(order: PurchaseOrder): Promise<void>;
  abstract delete(order: PurchaseOrder): Promise<void>;
}
