import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { SaleOrder } from '../entities/sale-order';

export class SaleOrderCreatedEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly saleOrder: SaleOrder) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.saleOrder.id;
  }
}
