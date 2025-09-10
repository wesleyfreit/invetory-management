import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { PurchaseOrderConfirmedEvent } from '../events/purchase-order-confirmed-event';
import { PurchaseOrderProduct } from './value-objects/purchase-order-product';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderProps {
  products: PurchaseOrderProduct[];
  status: PurchaseOrderStatus;
  orderedAt: Date;
}

export class PurchaseOrder extends AggregateRoot<PurchaseOrderProps> {
  get products(): PurchaseOrderProduct[] {
    return this.props.products;
  }

  set products(products: PurchaseOrderProduct[]) {
    this.props.products = products;
  }

  get status(): PurchaseOrderStatus {
    return this.props.status;
  }

  get orderedAt(): Date {
    return this.props.orderedAt;
  }

  confirm() {
    this.props.status = PurchaseOrderStatus.CONFIRMED;
    this.addDomainEvent(new PurchaseOrderConfirmedEvent(this));
  }

  finish() {
    this.props.status = PurchaseOrderStatus.FINISHED;
  }

  cancel() {
    this.props.status = PurchaseOrderStatus.CANCELLED;
  }

  static create(
    props: Optional<PurchaseOrderProps, 'status' | 'orderedAt'>,
    id?: UniqueEntityID,
  ): PurchaseOrder {
    const purchaseOrder = new PurchaseOrder(
      {
        ...props,
        orderedAt: props.orderedAt ?? new Date(),
        status: props.status ?? PurchaseOrderStatus.PENDING,
      },
      id,
    );

    return purchaseOrder;
  }
}
