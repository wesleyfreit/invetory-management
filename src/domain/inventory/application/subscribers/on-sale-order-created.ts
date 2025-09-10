import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SaleOrderCreatedEvent } from '../../enterprise/events/order-created-event';
import { ProductsRepository } from '../repositories/products-repository';
import { SaleOrdersRepository } from '../repositories/sale-orders-repository';
import { ProcessStockForSaleOrderUseCase } from '../use-cases/process-stock-for-sale-order';

export class OnSaleOrderCreated implements EventHandler {
  constructor(
    private processStockForSaleOrder: ProcessStockForSaleOrderUseCase,
    private saleOrdersRepository: SaleOrdersRepository,
    private productsRepository: ProductsRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.processAndFinishOrder.bind(this),
      SaleOrderCreatedEvent.name,
    );
  }

  private async processAndFinishOrder({ saleOrder }: SaleOrderCreatedEvent) {
    const result = await this.processStockForSaleOrder.execute({ saleOrder });

    if (result.isLeft()) {
      saleOrder.cancel();
    }

    if (result.isRight()) {
      const { productsToUpdate } = result.value;

      await Promise.all(
        productsToUpdate.map((product) => this.productsRepository.save(product)),
      );

      saleOrder.finish();
    }

    await this.saleOrdersRepository.save(saleOrder);
  }
}
