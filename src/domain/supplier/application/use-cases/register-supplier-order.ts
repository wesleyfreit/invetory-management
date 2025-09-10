import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SupplierOrder } from '../../enterprise/entities/supplier-order';
import { SupplierOrderProduct } from '../../enterprise/entities/value-objects/supplier-order-product';
import { SupplierOrdersRepository } from '../repositories/supplier-orders-repository';

interface RegisterSupplierOrderUseCaseRequest {
  purchaseOrderId: string;
  requestedProducts: SupplierOrderProduct[];
}

type RegisterSupplierOrderUseCaseResponse = Either<
  null,
  {
    supplierOrder: SupplierOrder;
  }
>;

export class RegisterSupplierOrderUseCase {
  constructor(private supplierOrdersRepository: SupplierOrdersRepository) {}

  async execute({
    purchaseOrderId,
    requestedProducts,
  }: RegisterSupplierOrderUseCaseRequest): Promise<RegisterSupplierOrderUseCaseResponse> {
    const supplierOrder = SupplierOrder.create({
      purchaseOrderId: new UniqueEntityID(purchaseOrderId),
      requestedProducts,
    });

    await this.supplierOrdersRepository.create(supplierOrder);

    return right({
      supplierOrder: supplierOrder,
    });
  }
}
