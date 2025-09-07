import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { ProductInLowStockEvent } from '../events/product-in-low-stock-event';

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
  stock: number;
  minStock: number;
}

export class Product extends AggregateRoot<ProductProps> {
  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get size(): string {
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

  get stock(): number {
    return this.props.stock;
  }

  set stock(stock: number) {
    this.props.stock = stock;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  set minStock(minStock: number) {
    this.props.minStock = minStock;
  }

  public canFulfillOrder(quantity: number): boolean {
    return this.props.stock >= quantity;
  }

  public isInLowStock() {
    return this.props.stock <= this.props.minStock;
  }

  public decreaseStock(quantity: number) {
    if (!this.canFulfillOrder(quantity)) {
      throw new Error('Insufficient stock');
    }

    this.props.stock -= quantity;

    if (this.isInLowStock()) {
      this.addDomainEvent(new ProductInLowStockEvent(this));
    }
  }

  static create(props: Optional<ProductProps, 'minStock'>, id?: UniqueEntityID): Product {
    const product = new Product({ ...props, minStock: props.minStock ?? 1 }, id);
    return product;
  }
}
