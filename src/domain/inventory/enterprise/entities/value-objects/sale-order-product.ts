import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface SaleOrderProductProps {
  productId: UniqueEntityID;
  price: number;
  quantity: number;
}

export class SaleOrderProduct extends ValueObject<SaleOrderProductProps> {
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get price(): number {
    return this.props.price;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  static create(props: SaleOrderProductProps): SaleOrderProduct {
    const saleOrderProduct = new SaleOrderProduct(props);
    return saleOrderProduct;
  }
}
