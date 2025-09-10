import { makePurchaseOrder } from 'test/factories/make-purchase-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryPurchaseOrdersRepository } from 'test/repositories/in-memory-purchase-orders-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { PurchaseOrderStatus } from '../../enterprise/entities/purchase-order';
import { ConfirmPurchaseOrderUseCase } from './confirm-purchase-order';

let productsRepository: InMemoryProductsRepository;
let salesOrdersRepository: InMemorySaleOrdersRepository;
let purchaseOrdersRepository: InMemoryPurchaseOrdersRepository;

let sut: ConfirmPurchaseOrderUseCase;

describe('Confirm Purchase Order Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    salesOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository(
      salesOrdersRepository,
    );
    sut = new ConfirmPurchaseOrderUseCase(purchaseOrdersRepository);
  });

  it('should be able to confirm a purchase order', async () => {
    const purchaseOrder = makePurchaseOrder();

    await purchaseOrdersRepository.create(purchaseOrder);

    const result = await sut.execute({
      purchaseOrderId: purchaseOrder.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(purchaseOrdersRepository.items[0].id).toBe(purchaseOrder.id);
    expect(purchaseOrdersRepository.items[0].status).toBe(PurchaseOrderStatus.CONFIRMED);
  });
});
