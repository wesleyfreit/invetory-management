import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  PurchaseOrder,
  PurchaseOrderProps,
} from '@/domain/inventory/enterprise/entities/purchase-order';
import { makePurchaseProduct } from './make-purchase-product';

export function makePurchaseOrder(
  overrides: Partial<PurchaseOrderProps> = {},
  id?: UniqueEntityID,
): PurchaseOrder {
  const purchaseOrder = PurchaseOrder.create(
    {
      products: [
        makePurchaseProduct(),
        makePurchaseProduct(),
        makePurchaseProduct(),
        makePurchaseProduct(),
      ],
      ...overrides,
    },
    id,
  );

  return purchaseOrder;
}
