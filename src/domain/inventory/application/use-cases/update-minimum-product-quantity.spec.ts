import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { UpdateMinimumProductQuantityUseCase } from './update-minimum-product-quantity';

let productsRepository: InMemoryProductsRepository;

let sut: UpdateMinimumProductQuantityUseCase;

describe('Update Minimum Product Quantity By Id Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateMinimumProductQuantityUseCase(productsRepository);
  });

  it('should be able to update the minimum product quantity by id', async () => {
    const product = makeProduct({
      quantity: 10,
      minQuantity: 2,
    });

    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      minQuantity: 5,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: product.id,
          minQuantity: 5,
        }),
      }),
    );
  });
});
