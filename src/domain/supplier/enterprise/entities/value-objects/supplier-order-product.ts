import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface SupplierOrderProductProps {
  productId: UniqueEntityID;
  productName: string;
  quantityRequested: number;
}

export class SupplierOrderProduct extends ValueObject<SupplierOrderProductProps> {
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get quantityRequested(): number {
    return this.props.quantityRequested;
  }

  static create(props: SupplierOrderProductProps): SupplierOrderProduct {
    const supplierOrderProduct = new SupplierOrderProduct(props);
    return supplierOrderProduct;
  }
}
