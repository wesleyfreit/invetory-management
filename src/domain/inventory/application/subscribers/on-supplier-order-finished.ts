import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SupplierOrderFinishedEvent } from '@/domain/supplier/enterprise/events/supplier-order-finished-event';
import { PurchaseOrdersRepository } from '../repositories/purchase-orders-repository';
import { UpdateProductInventoryUseCase } from '../use-cases/update-product-inventory';

export class OnSupplierOrderFinished implements EventHandler {
  constructor(
    private updateProductInventory: UpdateProductInventoryUseCase,
    private purchaseOrdersRepository: PurchaseOrdersRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.finishPurchaseOrder.bind(this),
      SupplierOrderFinishedEvent.name,
    );
  }

  private async finishPurchaseOrder({ supplierOrder }: SupplierOrderFinishedEvent) {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(
      supplierOrder.purchaseOrderId.toString(),
    );

    if (purchaseOrder) {
      for (const product of purchaseOrder.products) {
        await this.updateProductInventory.execute({
          productId: product.productId.toString(),
          stock: product.suggestedQuantity,
        });
      }

      purchaseOrder.finish();

      await this.purchaseOrdersRepository.save(purchaseOrder);
    }
  }
}
