import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { PurchaseOrdersRepository } from '@/domain/inventory/application/repositories/purchase-orders-repository';
import { PurchaseOrderConfirmedEvent } from '@/domain/inventory/enterprise/events/purchase-order-confirmed-event';
import { SupplierOrderProduct } from '../../enterprise/entities/value-objects/supplier-order-product';
import { RegisterSupplierOrderUseCase } from '../use-cases/register-supplier-order';

export class OnPurchaseOrderConfirmed implements EventHandler {
  constructor(
    private registerSupplierOrder: RegisterSupplierOrderUseCase,
    private purchaseOrdersRepository: PurchaseOrdersRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.receivePurchaseOrder.bind(this),
      PurchaseOrderConfirmedEvent.name,
    );
  }

  private async receivePurchaseOrder({ purchaseOrder }: PurchaseOrderConfirmedEvent) {
    const order = await this.purchaseOrdersRepository.findById(
      purchaseOrder.id.toString(),
    );

    if (order) {
      const requestedProducts = order.products.map((product) =>
        SupplierOrderProduct.create({
          productId: product.productId,
          productName: product.productName,
          quantityRequested: product.suggestedQuantity,
        }),
      );

      await this.registerSupplierOrder.execute({
        purchaseOrderId: purchaseOrder.id.toString(),
        requestedProducts,
      });
    }
  }
}
