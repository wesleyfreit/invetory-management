import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { SupplierOrder } from '../entities/supplier-order';

export class SupplierOrderFinishedEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly supplierOrder: SupplierOrder) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.supplierOrder.id;
  }
}
