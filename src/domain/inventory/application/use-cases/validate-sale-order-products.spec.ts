import { makeProduct } from 'test/factories/make-product';
import { makeSaleOrder } from 'test/factories/make-sale-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { SaleOrderProduct } from '../../enterprise/entities/value-objects/sale-order-product';
import { ValidateSaleOrderProductsUseCase } from './validate-sale-order-products';
import { makeInventory } from 'test/factories/make-inventory';

let productsRepository: InMemoryProductsRepository;

let sut: ValidateSaleOrderProductsUseCase;

describe('Validate Sale Order Products Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();

    sut = new ValidateSaleOrderProductsUseCase(productsRepository);
  });

  it('should be able to validate the sale order products to finish sale order', async () => {
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

    const result = await sut.execute({
      saleOrder,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      await Promise.all(
        result.value.productsToUpdate.map(async (product) => {
          await productsRepository.save(product);
        }),
      );
    }

    expect(productsRepository.items[0].inventory.stock).toBe(7);
    expect(productsRepository.items[1].inventory.stock).toBe(7);
  });
});
