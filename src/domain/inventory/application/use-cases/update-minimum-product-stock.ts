import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface UpdateMinimumProductStockUseCaseRequest {
  productId: string;
  minStock: number;
}

type UpdateMinimumProductStockUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

export class UpdateMinimumProductStockUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    minStock,
  }: UpdateMinimumProductStockUseCaseRequest): Promise<UpdateMinimumProductStockUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    product.updateMinStock(minStock);

    await this.productsRepository.save(product);

    return right({
      product,
    });
  }
}
