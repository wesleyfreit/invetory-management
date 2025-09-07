import { DomainEvents } from '@/core/events/domain-events';
import { SaleOrdersRepository } from '@/domain/inventory/application/repositories/sale-orders-repository';
import { SaleOrder } from '@/domain/inventory/enterprise/entities/sale-order';

export class InMemorySaleOrdersRepository implements SaleOrdersRepository {
  public items: SaleOrder[] = [];

  async create(saleOrder: SaleOrder): Promise<void> {
    this.items.push(saleOrder);

    DomainEvents.dispatchEventsForAggregate(saleOrder.id);
  }

  async findById(orderId: string): Promise<SaleOrder | null> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async findAll(): Promise<SaleOrder[]> {
    return this.items;
  }

  async save(saleOrder: SaleOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === saleOrder.id);

    this.items[orderIndex] = saleOrder;
  }

  async delete(saleOrder: SaleOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === saleOrder.id);

    this.items.splice(orderIndex, 1);
  }
}
