import {
  SupplierOrderProduct,
  SupplierOrderProductProps,
} from '@/domain/supplier/enterprise/entities/value-objects/supplier-order-product';
import { faker } from '@faker-js/faker';
import { makeProduct } from './make-product';

export function makeSupplierProduct(
  overrides: Partial<SupplierOrderProductProps> = {},
): SupplierOrderProduct {
  const product = makeProduct();

  const supplierProduct = SupplierOrderProduct.create({
    productId: product.id,
    productName: product.name,
    quantityRequested: faker.number.int({ min: 5, max: 20 }),
    ...overrides,
  });

  return supplierProduct;
}
