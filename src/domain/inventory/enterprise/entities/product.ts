import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductInLowStockEvent } from '../events/product-in-low-stock-event';
import { ProductInventory } from './value-objects/product-inventory';

export enum ProductSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface ProductProps {
  name: string;
  size: ProductSize;
  price: number;
  color: string;
  inventory: ProductInventory;
}

export class Product extends AggregateRoot<ProductProps> {
  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get size(): ProductSize {
    return this.props.size;
  }

  set size(size: ProductSize) {
    this.props.size = size;
  }

  get price(): number {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
  }

  get color(): string {
    return this.props.color;
  }

  set color(color: string) {
    this.props.color = color;
  }

  get inventory(): ProductInventory {
    return this.props.inventory;
  }

  set inventory(inventory: ProductInventory) {
    this.props.inventory = inventory;
  }

  public updateMinStock(minStock: number) {
    this.props.inventory = this.props.inventory.updateMinStock(minStock);
  }

  public updateCostPrice(costPrice: number) {
    this.props.inventory = this.props.inventory.updateCostPrice(costPrice);
  }

  public increaseStock(quantity: number) {
    this.props.inventory = this.props.inventory.increaseStock(quantity);
  }

  public decreaseStock(quantity: number) {
    this.props.inventory = this.props.inventory.decreaseStock(quantity);

    if (this.props.inventory.isInLowStock()) {
      this.addDomainEvent(new ProductInLowStockEvent(this));
    }
  }

  static create(props: ProductProps, id?: UniqueEntityID): Product {
    const product = new Product(props, id);
    return product;
  }
}
