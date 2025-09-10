import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { PurchaseOrder } from '../entities/purchase-order';

export class PurchaseOrderConfirmedEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly purchaseOrder: PurchaseOrder) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.purchaseOrder.id;
  }
}
