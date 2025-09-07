import { Either, right } from '@/core/either';
import { Product } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface CreateProductUseCaseRequest {
  name: string;
  size: string;
  color: string;
  quantity: number;
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
    color,
    quantity,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      size,
      color,
      quantity,
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
