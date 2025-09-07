import { Either, right } from '@/core/either';
import { Product, ProductSize } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface CreateProductUseCaseRequest {
  name: string;
  size: ProductSize;
  price: number;
  color: string;
  stock: number;
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
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      size,
      price,
      color,
      stock,
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
