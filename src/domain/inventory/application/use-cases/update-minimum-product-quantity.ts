import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface UpdateMinimumProductQuantityUseCaseRequest {
  productId: string;
  minQuantity: number;
}

type UpdateMinimumProductQuantityUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

export class UpdateMinimumProductQuantityUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    minQuantity,
  }: UpdateMinimumProductQuantityUseCaseRequest): Promise<UpdateMinimumProductQuantityUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    product.minQuantity = minQuantity;

    await this.productsRepository.save(product);

    return right({
      product,
    });
  }
}
