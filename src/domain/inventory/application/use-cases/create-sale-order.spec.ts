import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { CreateSaleOrderUseCase } from './create-sale-order';

let productsRepository: InMemoryProductsRepository;
let saleOrdersRepository: InMemorySaleOrdersRepository;

let sut: CreateSaleOrderUseCase;

describe('Create Sale Order Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    saleOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);

    sut = new CreateSaleOrderUseCase(saleOrdersRepository, productsRepository);
  });

  it('should be able to create a sale order with products', async () => {
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

    const result = await sut.execute({
      products: products.map((product) => ({
        productId: product.id.toString(),
        quantity: 3,
      })),
    });

    const totalAmount = 3 * products[0].price + 3 * products[1].price;

    expect(result.isRight()).toBe(true);
    expect(saleOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        total: totalAmount,
        products: expect.arrayContaining([
          expect.objectContaining({
            productId: products[0].id,
            quantity: 3,
            price: products[0].price,
          }),
          expect.objectContaining({
            productId: products[1].id,
            quantity: 3,
            price: products[1].price,
          }),
        ]),
      }),
    );
  });
});
