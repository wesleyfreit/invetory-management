import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  SupplierOrder,
  SupplierOrderProps,
} from '@/domain/supplier/enterprise/entities/supplier-order';
import { makeSupplierProduct } from './make-supplier-product';

export function makeSupplierOrder(
  overrides: Partial<SupplierOrderProps> = {},
  id?: UniqueEntityID,
): SupplierOrder {
  const supplierOrder = SupplierOrder.create(
    {
      purchaseOrderId: new UniqueEntityID(),
      requestedProducts: [
        makeSupplierProduct(),
        makeSupplierProduct(),
        makeSupplierProduct(),
        makeSupplierProduct(),
      ],
      ...overrides,
    },
    id,
  );

  return supplierOrder;
}
