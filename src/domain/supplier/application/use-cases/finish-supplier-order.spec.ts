import { InMemorySupplierOrdersRepository } from 'test/repositories/in-memory-supplier-orders-repository';

import { makeSupplierOrder } from 'test/factories/make-supplier-order';
import { SupplierOrderStatus } from '../../enterprise/entities/supplier-order';
import { FinishSupplierOrderUseCase } from './finish-supplier-order';

let supplierOrdersRepository: InMemorySupplierOrdersRepository;

let sut: FinishSupplierOrderUseCase;

describe('Finish SupplierFinishSupplierOrderUseCase Order Use Case', () => {
  beforeEach(() => {
    supplierOrdersRepository = new InMemorySupplierOrdersRepository();

    sut = new FinishSupplierOrderUseCase(supplierOrdersRepository);
  });

  it('should be able to finish a supplier order', async () => {
    const supplierOrder = makeSupplierOrder({ status: SupplierOrderStatus.PENDING });

    await supplierOrdersRepository.create(supplierOrder);

    const result = await sut.execute({
      supplierOrderId: supplierOrder.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(supplierOrdersRepository.items[0].id).toBe(supplierOrder.id);
    expect(supplierOrdersRepository.items[0].status).toBe(SupplierOrderStatus.FINISHED);
  });
});
