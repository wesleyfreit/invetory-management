import { Either, right } from '@/core/either';
import { SalesTrend } from '../../enterprise/entities/value-objects/sales-trend';
import { SaleOrdersRepository } from '../repositories/sale-orders-repository';

interface GetSalesTrendsRequest {
  startDate: Date;
  endDate: Date;
}

type GetSalesTrendsResponse = Either<
  null,
  {
    salesTrends: SalesTrend[];
  }
>;

export class GetSalesTrendsUseCase {
  constructor(private saleOrdersRepository: SaleOrdersRepository) {}

  async execute({
    startDate,
    endDate,
  }: GetSalesTrendsRequest): Promise<GetSalesTrendsResponse> {
    const salesTrends = await this.saleOrdersRepository.analyzeSalesTrends(
      startDate,
      endDate,
    );

    return right({ salesTrends });
  }
}
