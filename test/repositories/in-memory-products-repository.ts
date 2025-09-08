import { DomainEvents } from '@/core/events/domain-events';
import { ProductsRepository } from '@/domain/inventory/application/repositories/products-repository';
import { Product } from '@/domain/inventory/enterprise/entities/product';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async findById(productId: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === productId);

    if (!product) {
      return null;
    }

    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.items;
  }

  async save(product: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === product.id);

    this.items[productIndex] = product;

    DomainEvents.dispatchEventsForAggregate(product.id);
  }

  async delete(product: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === product.id);

    this.items.splice(productIndex, 1);
  }
}
