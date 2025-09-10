import { SupplierOrderStatus } from '@/domain/supplier/enterprise/entities/supplier-order';
import { faker } from '@faker-js/faker';
import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { makePurchaseOrder } from 'test/factories/make-purchase-order';
import { makePurchaseProduct } from 'test/factories/make-purchase-product';
import { makeSupplierOrder } from 'test/factories/make-supplier-order';
import { makeSupplierProduct } from 'test/factories/make-supplier-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryPurchaseOrdersRepository } from 'test/repositories/in-memory-purchase-orders-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { InMemorySupplierOrdersRepository } from 'test/repositories/in-memory-supplier-orders-repository';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { PurchaseOrderStatus } from '../../enterprise/entities/purchase-order';
import { UpdateProductInventoryUseCase } from '../use-cases/update-product-inventory';
import { OnSupplierOrderFinished } from './on-supplier-order-finished';

let productsRepository: InMemoryProductsRepository;
let salesOrdersRepository: InMemorySaleOrdersRepository;
let purchaseOrdersRepository: InMemoryPurchaseOrdersRepository;
let supplierOrdersRepository: InMemorySupplierOrdersRepository;

let sut: UpdateProductInventoryUseCase;

let finishPurchaseOrderExecuteSpy: MockInstance;

describe('On Supplier Order Finished', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    salesOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository(
      salesOrdersRepository,
    );

    supplierOrdersRepository = new InMemorySupplierOrdersRepository();

    sut = new UpdateProductInventoryUseCase(productsRepository);

    finishPurchaseOrderExecuteSpy = vi.spyOn(purchaseOrdersRepository, 'save');

    new OnSupplierOrderFinished(sut, purchaseOrdersRepository);
  });

  it('should be able to update product inventory and finish the purchase order when a supplier order is finished', async () => {
    const products = Array.from({ length: 5 }).map(() =>
      makeProduct({
        price: faker.number.float({ min: 200, max: 500 }),
        inventory: makeInventory({
          stock: 20,
          minStock: 10,
          costPrice: faker.number.float({ min: 100, max: 200 }),
        }),
      }),
    );

    await Promise.all(products.map((product) => productsRepository.create(product)));

    const purchaseOrder = makePurchaseOrder({
      status: PurchaseOrderStatus.CONFIRMED,
      products: products.map((product) =>
        makePurchaseProduct({
          productId: product.id,
          productName: product.name,
          suggestedQuantity: 15,
        }),
      ),
    });

    await purchaseOrdersRepository.create(purchaseOrder);

    const supplierOrder = makeSupplierOrder({
      purchaseOrderId: purchaseOrder.id,
      requestedProducts: purchaseOrder.products.map((product) =>
        makeSupplierProduct({
          productId: product.productId,
          productName: product.productName,
          quantityRequested: product.suggestedQuantity,
        }),
      ),
    });

    await supplierOrdersRepository.create(supplierOrder);

    supplierOrder.finish();

    await supplierOrdersRepository.save(supplierOrder);

    await waitFor(() => {
      expect(finishPurchaseOrderExecuteSpy).toHaveBeenCalled();
    });

    expect(supplierOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: supplierOrder.id,
        purchaseOrderId: purchaseOrder.id,
        status: SupplierOrderStatus.FINISHED,
      }),
    );

    expect(purchaseOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: purchaseOrder.id,
        status: PurchaseOrderStatus.FINISHED,
      }),
    );

    expect(productsRepository.items[0]).toEqual(
      expect.objectContaining({
        inventory: expect.objectContaining({
          stock: 35,
        }),
      }),
    );
  });
});
