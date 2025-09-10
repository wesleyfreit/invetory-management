import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface PurchaseOrderProductProps {
  productId: UniqueEntityID;
  productName: string;
  suggestedQuantity: number;
}

export class PurchaseOrderProduct extends ValueObject<PurchaseOrderProductProps> {
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get suggestedQuantity(): number {
    return this.props.suggestedQuantity;
  }

  static create(props: PurchaseOrderProductProps): PurchaseOrderProduct {
    const purchaseOrderProduct = new PurchaseOrderProduct(props);
    return purchaseOrderProduct;
  }
}
