import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface ProductProps {
  name: string;
  size: string;
  color: string;
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

  static create(props: ProductProps, id?: UniqueEntityID): Product {
    const product = new Product(props, id);
    return product;
  }
}
