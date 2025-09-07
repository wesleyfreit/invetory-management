import { UseCaseError } from '@/core/errors/use-case-error';

export class InsufficientStockError extends Error implements UseCaseError {
  constructor(productId: string) {
    super(`Insufficient stock for product ${productId}`);
  }
}
