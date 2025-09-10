import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  SaleOrder,
  SaleOrderProps,
} from '@/domain/inventory/enterprise/entities/sale-order';
import { makeSaleProduct } from './make-sale-product';

export function makeSaleOrder(
  overrides: Partial<SaleOrderProps> = {},
  id?: UniqueEntityID,
): SaleOrder {
  const saleOrder = SaleOrder.create(
    {
      products: [
        makeSaleProduct(),
        makeSaleProduct(),
        makeSaleProduct(),
        makeSaleProduct(),
      ],
      ...overrides,
    },
    id,
  );

  return saleOrder;
}
