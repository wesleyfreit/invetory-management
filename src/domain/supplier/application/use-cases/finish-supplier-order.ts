import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { SupplierOrdersRepository } from '../repositories/supplier-orders-repository';

interface FinishSupplierOrderUseCaseRequest {
  supplierOrderId: string;
}

type FinishSupplierOrderUseCaseResponse = Either<ResourceNotFoundError, null>;

export class FinishSupplierOrderUseCase {
  constructor(private supplierOrdersRepository: SupplierOrdersRepository) {}

  async execute({
    supplierOrderId,
  }: FinishSupplierOrderUseCaseRequest): Promise<FinishSupplierOrderUseCaseResponse> {
    const supplierOrder = await this.supplierOrdersRepository.findById(supplierOrderId);

    if (!supplierOrder) {
      return left(new ResourceNotFoundError());
    }

    supplierOrder.finish();

    await this.supplierOrdersRepository.save(supplierOrder);

    return right(null);
  }
}
