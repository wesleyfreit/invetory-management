import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface ProductProfit {
  productId: UniqueEntityID;
  productName: string;
  quantitySold: number;
  totalProfit: number;
  totalRevenue: number;
}

export interface SalesHistoryProps {
  startPeriod: Date;
  endPeriod: Date;
  soldProductsInThePeriod: number;
  totalRevenueInThePeriod: number;
  soldProducts: ProductProfit[];
  topSellingProducts: ProductProfit[];
}

export class SalesHistory extends ValueObject<SalesHistoryProps> {
  get startPeriod(): Date {
    return this.props.startPeriod;
  }

  get endPeriod(): Date {
    return this.props.endPeriod;
  }

  get soldProductsInThePeriod(): number {
    return this.props.soldProductsInThePeriod;
  }

  get totalRevenueInThePeriod(): number {
    return this.props.totalRevenueInThePeriod;
  }

  get soldProducts(): ProductProfit[] {
    return this.props.soldProducts;
  }

  get topSellingProducts(): ProductProfit[] {
    return this.props.topSellingProducts;
  }

  static create(props: SalesHistoryProps): SalesHistory {
    const salesHistory = new SalesHistory(props);
    return salesHistory;
  }
}
