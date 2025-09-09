import { DomainEvents } from '@/core/events/domain-events';
import { SaleOrdersRepository } from '@/domain/inventory/application/repositories/sale-orders-repository';
import { SaleOrder } from '@/domain/inventory/enterprise/entities/sale-order';
import {
  ProductProfit,
  SalesHistory,
} from '@/domain/inventory/enterprise/entities/value-objects/sales-history';
import { InMemoryProductsRepository } from './in-memory-products-repository';

export class InMemorySaleOrdersRepository implements SaleOrdersRepository {
  public items: SaleOrder[] = [];

  constructor(private productsRepository: InMemoryProductsRepository) {}

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

  async generateSalesHistoryByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<SalesHistory> {
    const saleOrders = this.items.filter((order) => {
      return order.orderedAt >= startDate && order.orderedAt <= endDate;
    });

    const soldProductsInThePeriod = saleOrders.reduce((acc, order) => {
      return acc + order.products.reduce((sum, prod) => sum + prod.quantity, 0);
    }, 0);

    const totalRevenueInThePeriod = saleOrders.reduce(
      (acc, order) => acc + order.total,
      0,
    );

    const soldProducts = saleOrders
      .flatMap((order) => order.products)
      .reduce((acc, orderProduct) => {
        const product = this.productsRepository.items.find(
          (p) => p.id.toString() === orderProduct.productId.toString(),
        );

        if (!product) {
          return acc;
        }

        const existingProduct = acc.find(
          (p) => p.productId.toString() === orderProduct.productId.toString(),
        );

        if (existingProduct) {
          existingProduct.quantitySold += orderProduct.quantity;
          existingProduct.totalProfit +=
            (orderProduct.price - product.inventory.costPrice) * orderProduct.quantity;
          existingProduct.totalRevenue += orderProduct.price * orderProduct.quantity;
        } else {
          acc.push({
            productId: orderProduct.productId,
            productName: product.name,
            quantitySold: orderProduct.quantity,
            totalProfit:
              (orderProduct.price - product.inventory.costPrice) * orderProduct.quantity,
            totalRevenue: orderProduct.price * orderProduct.quantity,
          });
        }

        return acc;
      }, [] as ProductProfit[]);

    return SalesHistory.create({
      startPeriod: startDate,
      endPeriod: endDate,
      soldProductsInThePeriod,
      totalRevenueInThePeriod,
      soldProducts,
      topSellingProducts: [...soldProducts]
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 10),
    });
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
