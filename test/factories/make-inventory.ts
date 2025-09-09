import {
  ProductInventory,
  ProductInventoryProps,
} from '@/domain/inventory/enterprise/entities/value-objects/product-inventory';
import { faker } from '@faker-js/faker';

export function makeInventory(
  overrides: Partial<ProductInventoryProps> = {},
): ProductInventory {
  const inventory = ProductInventory.create({
    stock: faker.number.int({ min: 2, max: 100 }),
    costPrice: faker.number.float({ min: 5, max: 4000 }),
    minStock: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
  });

  return inventory;
}
