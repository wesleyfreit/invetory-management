import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { ProductInLowStockEvent } from '@/domain/inventory/enterprise/events/product-in-low-stock-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnProductInLowStock implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendLowStockNotification.bind(this),
      ProductInLowStockEvent.name,
    );
  }

  private async sendLowStockNotification({ product }: ProductInLowStockEvent) {
    await this.sendNotification.execute({
      emailTo: 'management@inventory.com',
      title: `O produto ${product.name} se encontra com estoque baixo`,
      content: `O produto ${product.name} ${product.minStock < product.stock ? 'ultrapassou' : 'atingiu'} o estoque mínimo de ${product.minStock}. Estoque atual: ${product.stock}.`,
    });
  }
}
