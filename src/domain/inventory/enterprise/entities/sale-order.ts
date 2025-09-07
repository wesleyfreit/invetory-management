import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { SaleOrderCreatedEvent } from '../events/order-created-event';
import { SaleOrderProduct } from './value-objects/sale-order-product';

export enum SaleOrderStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface OrderProps {
  products: SaleOrderProduct[];
  orderedAt: Date;
  status: SaleOrderStatus;
  total: number;
}

export class SaleOrder extends AggregateRoot<OrderProps> {
  get products(): SaleOrderProduct[] {
    return this.props.products;
  }

  get orderedAt(): Date {
    return this.props.orderedAt;
  }

  get status(): SaleOrderStatus {
    return this.props.status;
  }

  get total(): number {
    return this.props.total;
  }

  finish() {
    this.props.status = SaleOrderStatus.FINISHED;
  }

  cancel() {
    this.props.status = SaleOrderStatus.CANCELLED;
  }

  get isCancelled(): boolean {
    return this.props.status === SaleOrderStatus.CANCELLED;
  }

  static create(
    props: Optional<OrderProps, 'orderedAt' | 'status' | 'total'>,
    id?: UniqueEntityID,
  ): SaleOrder {
    const totalAmout = props.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    const saleOrder = new SaleOrder(
      {
        ...props,
        orderedAt: props.orderedAt ?? new Date(),
        status: props.status ?? SaleOrderStatus.PENDING,
        total: totalAmout,
      },
      id,
    );

    saleOrder.addDomainEvent(new SaleOrderCreatedEvent(saleOrder));

    return saleOrder;
  }
}
