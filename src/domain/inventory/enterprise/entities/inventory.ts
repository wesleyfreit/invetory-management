import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface InventoryProps {
  productId: UniqueEntityID;
  amount: number;
  minAmount: number;
}

export class Inventory extends Entity<InventoryProps> {
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get amount(): number {
    return this.props.amount;
  }

  set amount(amount: number) {
    this.props.amount = amount;
  }

  get minAmount(): number {
    return this.props.minAmount;
  }

  set minAmount(minAmount: number) {
    this.props.minAmount = minAmount;
  }

  get isOnLowInventory(): boolean {
    return this.amount <= this.minAmount;
  }

  static create(
    props: Optional<InventoryProps, 'minAmount'>,
    id?: UniqueEntityID,
  ): Inventory {
    const inventory = new Inventory({ ...props, minAmount: props.minAmount ?? 1 }, id);
    return inventory;
  }
}
