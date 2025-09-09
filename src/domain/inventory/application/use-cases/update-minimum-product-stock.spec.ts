import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { UpdateMinimumProductStockUseCase } from './update-minimum-product-stock';

let productsRepository: InMemoryProductsRepository;

let sut: UpdateMinimumProductStockUseCase;

describe('Update Minimum Product Stock Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateMinimumProductStockUseCase(productsRepository);
  });

  it('should be able to update the minimum product stock by product id', async () => {
    const product = makeProduct({
      inventory: makeInventory({ stock: 10, minStock: 2 }),
    });

    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      minStock: 5,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: product.id,
          inventory: expect.objectContaining({
            minStock: 5,
          }),
        }),
      }),
    );
  });
});
