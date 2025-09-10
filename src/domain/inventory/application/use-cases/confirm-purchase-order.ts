import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { PurchaseOrdersRepository } from '../repositories/purchase-orders-repository';

interface ConfirmPurchaseOrderRequest {
  purchaseOrderId: string;
}

type ConfirmPurchaseOrderResponse = Either<ResourceNotFoundError, null>;

export class ConfirmPurchaseOrderUseCase {
  constructor(private purchaseOrdersRepository: PurchaseOrdersRepository) {}

  async execute({
    purchaseOrderId,
  }: ConfirmPurchaseOrderRequest): Promise<ConfirmPurchaseOrderResponse> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(purchaseOrderId);

    if (!purchaseOrder) {
      return left(new ResourceNotFoundError());
    }

    purchaseOrder.confirm();

    await this.purchaseOrdersRepository.save(purchaseOrder);

    return right(null);
  }
}
