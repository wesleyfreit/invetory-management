import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface ProductProps {
  name: string;
  size: string;
  color: string;
  quantity: number;
  minQuantity: number;
}

export class Product extends Entity<ProductProps> {
  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get size(): string {
    return this.props.size;
  }

  set size(size: string) {
    this.props.size = size;
  }

  get color(): string {
    return this.props.color;
  }

  set color(color: string) {
    this.props.color = color;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
  }

  get minQuantity(): number {
    return this.props.minQuantity;
  }

  set minQuantity(minQuantity: number) {
    this.props.minQuantity = minQuantity;
  }

  get isOnLowInventoryProduct(): boolean {
    return this.quantity <= this.minQuantity;
  }

  static create(
    props: Optional<ProductProps, 'minQuantity'>,
    id?: UniqueEntityID,
  ): Product {
    const product = new Product({ ...props, minQuantity: props.minQuantity ?? 1 }, id);
    return product;
  }
}
