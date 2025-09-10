import { makePurchaseOrder } from 'test/factories/make-purchase-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryPurchaseOrdersRepository } from 'test/repositories/in-memory-purchase-orders-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { InMemorySupplierOrdersRepository } from 'test/repositories/in-memory-supplier-orders-repository';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { SupplierOrderStatus } from '../../enterprise/entities/supplier-order';
import { RegisterSupplierOrderUseCase } from '../use-cases/register-supplier-order';
import { OnPurchaseOrderConfirmed } from './on-purchase-order-confirmed';

let productsRepository: InMemoryProductsRepository;
let salesOrdersRepository: InMemorySaleOrdersRepository;
let purchaseOrdersRepository: InMemoryPurchaseOrdersRepository;
let supplierOrdersRepository: InMemorySupplierOrdersRepository;

let sut: RegisterSupplierOrderUseCase;

let registerSupplierOrderExecuteSpy: MockInstance;

describe('On Purchase Order Confirmed', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    salesOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository(
      salesOrdersRepository,
    );

    supplierOrdersRepository = new InMemorySupplierOrdersRepository();

    sut = new RegisterSupplierOrderUseCase(supplierOrdersRepository);

    registerSupplierOrderExecuteSpy = vi.spyOn(supplierOrdersRepository, 'create');

    new OnPurchaseOrderConfirmed(sut, purchaseOrdersRepository);
  });

  it('should be able to create a supplier order when a purchase order is confirmed', async () => {
    const purchaseOrder = makePurchaseOrder();

    await purchaseOrdersRepository.create(purchaseOrder);

    purchaseOrder.confirm();

    await purchaseOrdersRepository.save(purchaseOrder);

    await waitFor(() => {
      expect(registerSupplierOrderExecuteSpy).toHaveBeenCalled();
    });

    expect(supplierOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        purchaseOrderId: purchaseOrder.id,
        status: SupplierOrderStatus.PENDING,
      }),
    );
  });
});
