import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Product } from '../entities/product';

export class ProductInLowStockEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly product: Product) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
