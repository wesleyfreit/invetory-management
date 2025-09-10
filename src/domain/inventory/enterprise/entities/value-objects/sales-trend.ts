import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface SalesTrendProps {
  productId: UniqueEntityID;
  productName: string;
  avgDailySales: number;
  salesGrowthRate: number;
  stockLevel: number;
  minStock: number;
  recommendedSafetyStock: number;
}

export class SalesTrend extends ValueObject<SalesTrendProps> {
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get avgDailySales(): number {
    return this.props.avgDailySales;
  }

  get salesGrowthRate(): number {
    return this.props.salesGrowthRate;
  }

  get stockLevel(): number {
    return this.props.stockLevel;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  get recommendedSafetyStock(): number {
    return this.props.recommendedSafetyStock;
  }

  static create(props: SalesTrendProps): SalesTrend {
    const salesTrend = new SalesTrend(props);
    return salesTrend;
  }
}
