import { SupplierOrder } from '../../enterprise/entities/supplier-order';

export abstract class SupplierOrdersRepository {
  abstract create(order: SupplierOrder): Promise<void>;
  abstract findById(orderId: string): Promise<SupplierOrder | null>;
  abstract findAll(): Promise<SupplierOrder[]>;
  abstract save(order: SupplierOrder): Promise<void>;
  abstract delete(order: SupplierOrder): Promise<void>;
}
