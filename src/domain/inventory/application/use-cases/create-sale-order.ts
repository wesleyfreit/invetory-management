import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { SaleOrder } from '../../enterprise/entities/sale-order';
import { SaleOrderProduct } from '../../enterprise/entities/value-objects/sale-order-product';
import { ProductsRepository } from '../repositories/products-repository';
import { SaleOrdersRepository } from '../repositories/sale-orders-repository';
import { InsufficientStockError } from './errors/insufficient-stock-error';

interface CreateSaleOrderUseCaseRequest {
  products: {
    productId: string;
    quantity: number;
  }[];
}

type CreateSaleOrderUseCaseResponse = Either<
  ResourceNotFoundError | InsufficientStockError,
  {
    saleOrder: SaleOrder;
  }
>;

export class CreateSaleOrderUseCase {
  constructor(
    private saleOrdersRepository: SaleOrdersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    products,
  }: CreateSaleOrderUseCaseRequest): Promise<CreateSaleOrderUseCaseResponse> {
    const orderProducts: SaleOrderProduct[] = [];

    for (const { productId, quantity } of products) {
      const product = await this.productsRepository.findById(productId);

      if (!product) {
        return left(new ResourceNotFoundError());
      }

      if (!product.inventory.canFulfillOrder(quantity)) {
        return left(new InsufficientStockError(productId));
      }

      orderProducts.push(
        SaleOrderProduct.create({
          productId: product.id,
          price: product.price,
          quantity,
        }),
      );
    }

    const saleOrder = SaleOrder.create({
      products: orderProducts,
    });

    await this.saleOrdersRepository.create(saleOrder);

    return right({
      saleOrder: saleOrder,
    });
  }
}
