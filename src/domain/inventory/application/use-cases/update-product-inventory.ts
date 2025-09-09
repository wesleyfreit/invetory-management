import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '../../enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

interface UpdateProductInventoryUseCaseRequest {
  productId: string;
  minStock?: number;
  costPrice?: number;
  stock?: number;
}

type UpdateProductInventoryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

export class UpdateProductInventoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    minStock,
    costPrice,
    stock,
  }: UpdateProductInventoryUseCaseRequest): Promise<UpdateProductInventoryUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (stock) {
      product.increaseStock(stock);
    }

    if (costPrice) {
      product.updateCostPrice(costPrice);
    }

    if (minStock) {
      product.updateMinStock(minStock);
    }

    await this.productsRepository.save(product);

    return right({
      product,
    });
  }
}
