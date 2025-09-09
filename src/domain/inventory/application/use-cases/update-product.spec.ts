import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { ProductSize } from '../../enterprise/entities/product';
import { UpdateProductUseCase } from './update-product';

let productsRepository: InMemoryProductsRepository;

let sut: UpdateProductUseCase;

describe('Update Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateProductUseCase(productsRepository);
  });

  it('should be able to update the product catalog by product id', async () => {
    const product = makeProduct({
      inventory: makeInventory({ stock: 10, minStock: 2 }),
    });

    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      name: 'New Product Name',
      size: ProductSize.MEDIUM,
      color: '#fff000',
      price: 59.99,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: product.id,
          name: 'New Product Name',
          size: ProductSize.MEDIUM,
          color: '#fff000',
          price: 59.99,
        }),
      }),
    );
  });
});
