import { DomainEvents } from '@/core/events/domain-events';

import { SupplierOrdersRepository } from '@/domain/supplier/application/repositories/supplier-orders-repository';
import { SupplierOrder } from '@/domain/supplier/enterprise/entities/supplier-order';

export class InMemorySupplierOrdersRepository implements SupplierOrdersRepository {
  public items: SupplierOrder[] = [];

  async create(supplierOrder: SupplierOrder): Promise<void> {
    this.items.push(supplierOrder);
  }

  async findById(orderId: string): Promise<SupplierOrder | null> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async findAll(): Promise<SupplierOrder[]> {
    return this.items;
  }

  async save(supplierOrder: SupplierOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === supplierOrder.id);

    this.items[orderIndex] = supplierOrder;

    DomainEvents.dispatchEventsForAggregate(supplierOrder.id);
  }

  async delete(supplierOrder: SupplierOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === supplierOrder.id);

    this.items.splice(orderIndex, 1);
  }
}
