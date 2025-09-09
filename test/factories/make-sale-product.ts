import {
  SaleOrderProduct,
  SaleOrderProductProps,
} from '@/domain/inventory/enterprise/entities/value-objects/sale-order-product';
import { makeProduct } from './make-product';

export function makeSaleProduct(
  overrides: Partial<SaleOrderProductProps> = {},
): SaleOrderProduct {
  const product = makeProduct();

  const saleProduct = SaleOrderProduct.create({
    productId: product.id,
    price: product.price,
    quantity: 5,
    ...overrides,
  });

  return saleProduct;
}
