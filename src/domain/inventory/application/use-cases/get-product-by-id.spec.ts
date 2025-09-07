import { makeProduct } from 'test/factories/make-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { GetProductByIdUseCase } from './get-product-by-id';

let productsRepository: InMemoryProductsRepository;

let sut: GetProductByIdUseCase;

describe('Get Product By Id Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new GetProductByIdUseCase(productsRepository);
  });

  it('should be able to get a product by id', async () => {
    const product = makeProduct();

    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: product.id,
        }),
      }),
    );
  });
});
