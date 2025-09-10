import { DomainEvents } from '@/core/events/domain-events';
import { PurchaseOrdersRepository } from '@/domain/inventory/application/repositories/purchase-orders-repository';
import { PurchaseOrder } from '@/domain/inventory/enterprise/entities/purchase-order';
import { PurchaseOrderProduct } from '@/domain/inventory/enterprise/entities/value-objects/purchase-order-product';
import { InMemorySaleOrdersRepository } from './in-memory-sale-orders-repository';

export class InMemoryPurchaseOrdersRepository implements PurchaseOrdersRepository {
  public items: PurchaseOrder[] = [];

  constructor(private saleOrdersRepository: InMemorySaleOrdersRepository) {}

  async create(purchaseOrder: PurchaseOrder): Promise<void> {
    this.items.push(purchaseOrder);
  }

  async createPurchaseOrderByTrends(
    startDate: Date,
    endDate: Date,
  ): Promise<PurchaseOrder> {
    const salesTrends = await this.saleOrdersRepository.analyzeSalesTrends(
      startDate,
      endDate,
    );

    const orderProducts = salesTrends
      .filter(
        (trend) => trend.stockLevel <= trend.minStock + trend.recommendedSafetyStock,
      )
      .map((trend) => {
        const suggestedQuantity = Math.ceil(
          trend.recommendedSafetyStock + trend.avgDailySales * 14 - trend.stockLevel,
        );

        return PurchaseOrderProduct.create({
          productId: trend.productId,
          productName: trend.productName,
          suggestedQuantity: suggestedQuantity > 0 ? suggestedQuantity : 0,
        });
      });

    const purchaseOrder = PurchaseOrder.create({
      products: orderProducts,
    });

    this.items.push(purchaseOrder);

    return purchaseOrder;
  }

  async findById(orderId: string): Promise<PurchaseOrder | null> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.items;
  }

  async save(purchaseOrder: PurchaseOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === purchaseOrder.id);

    this.items[orderIndex] = purchaseOrder;

    DomainEvents.dispatchEventsForAggregate(purchaseOrder.id);
  }

  async delete(purchaseOrder: PurchaseOrder): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === purchaseOrder.id);

    this.items.splice(orderIndex, 1);
  }
}
