import { Either, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { SalesHistory } from '../../enterprise/entities/value-objects/sales-history';
import { SaleOrdersRepository } from '../repositories/sale-orders-repository';
import { InsufficientStockError } from './errors/insufficient-stock-error';

interface GetSalesHistoryUseCaseRequest {
  startDate: Date;
  endDate: Date;
}

type GetSalesHistoryUseCaseResponse = Either<
  ResourceNotFoundError | InsufficientStockError,
  {
    salesHistory: SalesHistory;
  }
>;

export class GetSalesHistoryUseCase {
  constructor(private saleOrdersRepository: SaleOrdersRepository) {}

  async execute({
    startDate,
    endDate,
  }: GetSalesHistoryUseCaseRequest): Promise<GetSalesHistoryUseCaseResponse> {
    const salesHistory = await this.saleOrdersRepository.generateSalesHistoryByPeriod(
      startDate,
      endDate,
    );

    return right({
      salesHistory,
    });
  }
}
