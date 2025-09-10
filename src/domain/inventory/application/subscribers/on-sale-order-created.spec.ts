import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { makeSaleOrder } from 'test/factories/make-sale-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { SaleOrderStatus } from '../../enterprise/entities/sale-order';
import { SaleOrderProduct } from '../../enterprise/entities/value-objects/sale-order-product';
import { ProcessStockForSaleOrderUseCase } from '../use-cases/process-stock-for-sale-order';
import { OnSaleOrderCreated } from './on-sale-order-created';

let productsRepository: InMemoryProductsRepository;
let saleOrdersRepository: InMemorySaleOrdersRepository;

let sut: ProcessStockForSaleOrderUseCase;

let saveSaleOrderExecuteSpy: MockInstance;

describe('On Sale Order Created', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    saleOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);

    sut = new ProcessStockForSaleOrderUseCase(productsRepository);

    saveSaleOrderExecuteSpy = vi.spyOn(saleOrdersRepository, 'save');

    new OnSaleOrderCreated(sut, saleOrdersRepository, productsRepository);
  });

  it('should be able to validate sale order products, update stock and finish order', async () => {
    const products = [
      makeProduct({
        inventory: makeInventory({ stock: 10, minStock: 2 }),
      }),
      makeProduct({
        inventory: makeInventory({ stock: 10, minStock: 2 }),
      }),
    ];

    await Promise.all([
      productsRepository.create(products[0]),
      productsRepository.create(products[1]),
    ]);

    const orderProducts = products.map((product) =>
      SaleOrderProduct.create({
        productId: product.id,
        price: product.price,
        quantity: 3,
      }),
    );

    const saleOrder = makeSaleOrder({
      products: orderProducts,
    });

    await saleOrdersRepository.create(saleOrder);

    await waitFor(() => {
      expect(saveSaleOrderExecuteSpy).toHaveBeenCalled();
    });

    expect(saleOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        status: SaleOrderStatus.FINISHED,
      }),
    );

    expect(productsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: products[0].id,
          inventory: expect.objectContaining({
            stock: 7,
          }),
        }),
        expect.objectContaining({
          id: products[1].id,
          inventory: expect.objectContaining({
            stock: 7,
          }),
        }),
      ]),
    );
  });
});
