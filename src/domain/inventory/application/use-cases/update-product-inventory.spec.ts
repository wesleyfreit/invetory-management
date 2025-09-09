import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { UpdateProductInventoryUseCase } from './update-product-inventory';

let productsRepository: InMemoryProductsRepository;

let sut: UpdateProductInventoryUseCase;

describe('Update Product Inventory Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateProductInventoryUseCase(productsRepository);
  });

  it('should be able to update the product inventory by product id', async () => {
    const product = makeProduct({
      inventory: makeInventory({ stock: 10, minStock: 2 }),
    });

    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      minStock: 5,
      costPrice: 49.99,
      stock: 15,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: product.id,
          inventory: expect.objectContaining({
            minStock: 5,
            costPrice: 49.99,
            stock: 25,
          }),
        }),
      }),
    );
  });
});
