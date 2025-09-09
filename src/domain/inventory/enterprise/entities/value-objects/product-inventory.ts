// inventory.ts

import { ValueObject } from '@/core/entities/value-object';
import { Optional } from '@/core/types/optional';

export interface ProductInventoryProps {
  stock: number;
  minStock: number;
  costPrice: number;
}

export class ProductInventory extends ValueObject<ProductInventoryProps> {
  get stock(): number {
    return this.props.stock;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  public canFulfillOrder(quantity: number): boolean {
    return this.props.stock >= quantity;
  }

  public isInLowStock() {
    return this.props.stock <= this.props.minStock;
  }

  public updateMinStock(minStock: number): ProductInventory {
    return new ProductInventory({
      ...this.props,
      minStock,
    });
  }

  public updateCostPrice(costPrice: number): ProductInventory {
    return new ProductInventory({
      ...this.props,
      costPrice,
    });
  }

  public increaseStock(quantity: number): ProductInventory {
    return new ProductInventory({
      ...this.props,
      stock: this.props.stock + quantity,
    });
  }

  public decreaseStock(quantity: number): ProductInventory {
    if (!this.canFulfillOrder(quantity)) {
      throw new Error('Insufficient stock');
    }

    return new ProductInventory({
      ...this.props,
      stock: this.props.stock - quantity,
    });
  }
  static create(props: Optional<ProductInventoryProps, 'minStock'>): ProductInventory {
    const productInventory = new ProductInventory({
      ...props,
      minStock: props.minStock ?? 1,
    });
    return productInventory;
  }
}
