import { Either, right } from '@/core/either';
import { PurchaseOrder } from '../../enterprise/entities/purchase-order';
import { PurchaseOrdersRepository } from '../repositories/purchase-orders-repository';

interface CreatePurchaseOrderFromTrendsRequest {
  startDate: Date;
  endDate: Date;
}

type CreatePurchaseOrderFromTrendsResponse = Either<
  null,
  {
    purchaseOrder: PurchaseOrder;
  }
>;

export class CreatePurchaseOrderFromTrendsUseCase {
  constructor(private purchaseOrdersRepository: PurchaseOrdersRepository) {}

  async execute({
    startDate,
    endDate,
  }: CreatePurchaseOrderFromTrendsRequest): Promise<CreatePurchaseOrderFromTrendsResponse> {
    const purchaseOrder = await this.purchaseOrdersRepository.createPurchaseOrderByTrends(
      startDate,
      endDate,
    );

    return right({ purchaseOrder });
  }
}
