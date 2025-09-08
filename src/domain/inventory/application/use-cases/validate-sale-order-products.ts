import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '../../enterprise/entities/product';
import { SaleOrder } from '../../enterprise/entities/sale-order';
import { ProductsRepository } from '../repositories/products-repository';
import { InsufficientStockError } from './errors/insufficient-stock-error';

interface ValidateSaleOrderProductsRequest {
  saleOrder: SaleOrder;
}

type ValidateSaleOrderProductsResponse = Either<
  ResourceNotFoundError | InsufficientStockError,
  { productsToUpdate: Product[] }
>;

export class ValidateSaleOrderProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    saleOrder,
  }: ValidateSaleOrderProductsRequest): Promise<ValidateSaleOrderProductsResponse> {
    const productsToUpdate: Product[] = [];

    for (const orderProduct of saleOrder.products) {
      const product = await this.productsRepository.findById(
        orderProduct.productId.toString(),
      );

      if (!product) {
        return left(new ResourceNotFoundError());
      }

      if (!product.canFulfillOrder(orderProduct.quantity)) {
        return left(new InsufficientStockError(product.id.toString()));
      }

      product.decreaseStock(orderProduct.quantity);

      productsToUpdate.push(product);
    }

    return right({
      productsToUpdate,
    });
  }
}
