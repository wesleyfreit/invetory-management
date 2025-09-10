import {
  PurchaseOrderProduct,
  PurchaseOrderProductProps,
} from '@/domain/inventory/enterprise/entities/value-objects/purchase-order-product';
import { faker } from '@faker-js/faker';
import { makeProduct } from './make-product';

export function makePurchaseProduct(
  overrides: Partial<PurchaseOrderProductProps> = {},
): PurchaseOrderProduct {
  const product = makeProduct();

  const purchaseProduct = PurchaseOrderProduct.create({
    productId: product.id,
    productName: product.name,
    suggestedQuantity: faker.number.int({ min: 5, max: 20 }),
    ...overrides,
  });

  return purchaseProduct;
}
