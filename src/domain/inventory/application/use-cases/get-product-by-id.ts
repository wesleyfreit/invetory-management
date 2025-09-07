import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface GetProductByIdUseCaseRequest {
  productId: string;
}

type GetProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

export class GetProductByIdUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({
      product,
    });
  }
}
