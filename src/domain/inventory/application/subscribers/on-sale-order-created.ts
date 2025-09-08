import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SaleOrderCreatedEvent } from '../../enterprise/events/order-created-event';
import { ProductsRepository } from '../repositories/products-repository';
import { SaleOrdersRepository } from '../repositories/sale-orders-repository';
import { ValidateSaleOrderProductsUseCase } from '../use-cases/validate-sale-order-products';

export class OnSaleOrderCreated implements EventHandler {
  constructor(
    private validateSaleOrderProducts: ValidateSaleOrderProductsUseCase,
    private saleOrdersRepository: SaleOrdersRepository,
    private productsRepository: ProductsRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.validateOrder.bind(this), SaleOrderCreatedEvent.name);
  }

  private async validateOrder({ saleOrder }: SaleOrderCreatedEvent) {
    const result = await this.validateSaleOrderProducts.execute({ saleOrder });

    if (result.isLeft()) {
      console.error('Error during order product validation: ', result.value);

      saleOrder.cancel();
    } else {
      const { productsToUpdate } = result.value;

      if (!saleOrder.isCancelled) {
        await Promise.all(
          productsToUpdate.map((product) => this.productsRepository.save(product)),
        );

        saleOrder.finish();
      }
    }

    await this.saleOrdersRepository.save(saleOrder);
  }
}
