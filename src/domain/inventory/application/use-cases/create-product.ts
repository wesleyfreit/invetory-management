import { Either, right } from '@/core/either';
import { Product, ProductSize } from '../../enterprise/entities/product';
import { ProductInventory } from '../../enterprise/entities/value-objects/product-inventory';
import { ProductsRepository } from '../repositories/products-repository';

interface CreateProductUseCaseRequest {
  name: string;
  size: ProductSize;
  price: number;
  color: string;
  stock: number;
  minStock?: number;
  costPrice: number;
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product;
  }
>;

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    size,
    price,
    color,
    stock,
    minStock,
    costPrice,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const inventory = ProductInventory.create({ stock, costPrice, minStock });

    const product = Product.create({
      name,
      size,
      price,
      color,
      inventory,
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
