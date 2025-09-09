import { faker } from '@faker-js/faker';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { ProductSize } from '../../enterprise/entities/product';
import { CreateProductUseCase } from './create-product';

let productsRepository: InMemoryProductsRepository;

let sut: CreateProductUseCase;

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new CreateProductUseCase(productsRepository);
  });

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      name: faker.lorem.word(),
      color: faker.color.rgb(),
      price: faker.number.float({ min: 10, max: 5000 }),
      size: ProductSize.MEDIUM,
      stock: 10,
      costPrice: 100,
    });

    expect(result.isRight()).toBe(true);
  });
});
