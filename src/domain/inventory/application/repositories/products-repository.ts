import { Product } from '../../enterprise/entities/product';

export abstract class ProductsRepository {
  abstract create(product: Product): Promise<void>;
  abstract findById(productId: string): Promise<Product | null>;
  abstract findAll(): Promise<Product[]>;
  abstract delete(product: Product): Promise<void>;
  abstract save(product: Product): Promise<void>;
}
