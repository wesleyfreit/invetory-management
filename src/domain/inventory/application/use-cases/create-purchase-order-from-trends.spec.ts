import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { makeSaleOrder } from 'test/factories/make-sale-order';
import { makeSaleProduct } from 'test/factories/make-sale-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryPurchaseOrdersRepository } from 'test/repositories/in-memory-purchase-orders-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { PurchaseOrderStatus } from '../../enterprise/entities/purchase-order';
import { CreatePurchaseOrderFromTrendsUseCase } from './create-purchase-order-from-trends';

let productsRepository: InMemoryProductsRepository;
let saleOrdersRepository: InMemorySaleOrdersRepository;
let purchaseOrdersRepository: InMemoryPurchaseOrdersRepository;

let sut: CreatePurchaseOrderFromTrendsUseCase;

describe('Create Purchase Order From Trends Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    saleOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository(saleOrdersRepository);

    sut = new CreatePurchaseOrderFromTrendsUseCase(purchaseOrdersRepository);
  });

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should be able to create a purchase order from trends details by period', async () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const products = Array.from({ length: 5 }).map(() =>
      makeProduct({
        price: faker.number.float({ min: 200, max: 500 }),
        inventory: makeInventory({
          stock: faker.number.int(15),
          minStock: faker.number.int(10),
          costPrice: faker.number.float({ min: 100, max: 200 }),
        }),
      }),
    );

    await Promise.all(products.map((product) => productsRepository.create(product)));

    const saleOrders = Array.from({ length: 5 }).map(() =>
      makeSaleOrder({
        products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => {
          const product = faker.helpers.arrayElement(products);
          return makeSaleProduct({
            productId: product.id,
            price: product.price,
            quantity: faker.number.int(3),
          });
        }),
      }),
    );

    await Promise.all(saleOrders.map((order) => saleOrdersRepository.create(order)));

    vi.setSystemTime(new Date('2024-05-01T00:00:00Z'));

    const result = await sut.execute({
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-05-01T00:00:00Z'),
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual(
      expect.objectContaining({
        purchaseOrder: expect.objectContaining({
          status: PurchaseOrderStatus.PENDING,
          orderedAt: expect.any(Date),
          products: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(UniqueEntityID),
              productName: expect.any(String),
              suggestedQuantity: expect.any(Number),
            }),
          ]),
        }),
      }),
    );
  });
});
