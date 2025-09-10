import { makePurchaseOrder } from 'test/factories/make-purchase-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryPurchaseOrdersRepository } from 'test/repositories/in-memory-purchase-orders-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { InMemorySupplierOrdersRepository } from 'test/repositories/in-memory-supplier-orders-repository';

import { PurchaseOrderStatus } from '@/domain/inventory/enterprise/entities/purchase-order';
import { makeSupplierProduct } from 'test/factories/make-supplier-product';
import { SupplierOrderStatus } from '../../enterprise/entities/supplier-order';
import { RegisterSupplierOrderUseCase } from './register-supplier-order';

let productsRepository: InMemoryProductsRepository;
let salesOrdersRepository: InMemorySaleOrdersRepository;
let purchaseOrdersRepository: InMemoryPurchaseOrdersRepository;
let supplierOrdersRepository: InMemorySupplierOrdersRepository;

let sut: RegisterSupplierOrderUseCase;

describe('Register Supplier Order Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    salesOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository(
      salesOrdersRepository,
    );

    supplierOrdersRepository = new InMemorySupplierOrdersRepository();

    sut = new RegisterSupplierOrderUseCase(supplierOrdersRepository);
  });

  it('should be able to register a supplier order', async () => {
    const purchaseOrder = makePurchaseOrder({ status: PurchaseOrderStatus.CONFIRMED });

    await purchaseOrdersRepository.create(purchaseOrder);

    const requestedProducts = purchaseOrder.products.map((product) =>
      makeSupplierProduct({
        productId: product.productId,
        productName: product.productName,
        quantityRequested: product.suggestedQuantity,
      }),
    );

    const result = await sut.execute({
      purchaseOrderId: purchaseOrder.id.toString(),
      requestedProducts,
    });

    expect(result.isRight()).toBe(true);
    expect(supplierOrdersRepository.items[0].id).toBe(result.value?.supplierOrder.id);
    expect(supplierOrdersRepository.items[0].status).toBe(SupplierOrderStatus.PENDING);
  });
});
