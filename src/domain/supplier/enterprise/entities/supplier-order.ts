import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { SupplierOrderFinishedEvent } from '../events/supplier-order-finished-event';
import { SupplierOrderProduct } from './value-objects/supplier-order-product';

export enum SupplierOrderStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface SupplierOrderProps {
  purchaseOrderId: UniqueEntityID;
  requestedProducts: SupplierOrderProduct[];
  status: SupplierOrderStatus;
  requestedAt: Date;
}

export class SupplierOrder extends AggregateRoot<SupplierOrderProps> {
  get purchaseOrderId(): UniqueEntityID {
    return this.props.purchaseOrderId;
  }

  get requestedProducts(): SupplierOrderProduct[] {
    return this.props.requestedProducts;
  }

  set requestedProducts(products: SupplierOrderProduct[]) {
    this.props.requestedProducts = products;
  }

  get status(): SupplierOrderStatus {
    return this.props.status;
  }

  get requestedAt(): Date {
    return this.props.requestedAt;
  }

  finish() {
    this.props.status = SupplierOrderStatus.FINISHED;
    this.addDomainEvent(new SupplierOrderFinishedEvent(this));
  }

  cancel() {
    this.props.status = SupplierOrderStatus.CANCELLED;
  }

  static create(
    props: Optional<SupplierOrderProps, 'status' | 'requestedAt'>,
    id?: UniqueEntityID,
  ): SupplierOrder {
    const supplierOrder = new SupplierOrder(
      {
        ...props,
        requestedAt: props.requestedAt ?? new Date(),
        status: props.status ?? SupplierOrderStatus.PENDING,
      },
      id,
    );

    return supplierOrder;
  }
}
