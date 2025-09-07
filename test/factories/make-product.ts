import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/inventory/enterprise/entities/product';
import { faker } from '@faker-js/faker';

export function makeProduct(
  overrides: Partial<Product> = {},
  id?: UniqueEntityID,
): Product {
  const product = Product.create(
    {
      name: faker.lorem.word(),
      color: faker.color.rgb(),
      size: faker.helpers.arrayElement(['S', 'M', 'L']),
      quantity: faker.number.int({ min: 2, max: 100 }),
      ...overrides,
    },
    id,
  );

  return product;
}
