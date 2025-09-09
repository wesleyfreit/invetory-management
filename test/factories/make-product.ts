import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Product,
  ProductProps,
  ProductSize,
} from '@/domain/inventory/enterprise/entities/product';
import { faker } from '@faker-js/faker';
import { makeInventory } from './make-inventory';

export function makeProduct(
  overrides: Partial<ProductProps> = {},
  id?: UniqueEntityID,
): Product {
  const product = Product.create(
    {
      name: faker.lorem.word(),
      color: faker.color.rgb(),
      price: faker.number.float({ min: 10, max: 5000 }),
      size: faker.helpers.enumValue(ProductSize),
      inventory: makeInventory(),
      ...overrides,
    },
    id,
  );

  return product;
}
