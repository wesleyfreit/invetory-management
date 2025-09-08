import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  SaleOrder,
  SaleOrderProps,
} from '@/domain/inventory/enterprise/entities/sale-order';
import { SaleOrderProduct } from '@/domain/inventory/enterprise/entities/value-objects/sale-order-product';
import { makeProduct } from './make-product';

export function makeSaleOrder(
  overrides: Partial<SaleOrderProps> = {},
  id?: UniqueEntityID,
): SaleOrder {
  const saleOrder = SaleOrder.create(
    {
      products: [
        SaleOrderProduct.create({
          productId: makeProduct().id,
          price: 100,
          quantity: 5,
        }),
      ],
      ...overrides,
    },
    id,
  );

  return saleOrder;
}
