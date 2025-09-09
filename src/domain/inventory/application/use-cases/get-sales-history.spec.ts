import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import { makeInventory } from 'test/factories/make-inventory';
import { makeProduct } from 'test/factories/make-product';
import { makeSaleOrder } from 'test/factories/make-sale-order';
import { makeSaleProduct } from 'test/factories/make-sale-product';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemorySaleOrdersRepository } from 'test/repositories/in-memory-sale-orders-repository';
import { GetSalesHistoryUseCase } from './get-sales-history';

let productsRepository: InMemoryProductsRepository;
let saleOrdersRepository: InMemorySaleOrdersRepository;

let sut: GetSalesHistoryUseCase;

describe('Get Sales History Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    saleOrdersRepository = new InMemorySaleOrdersRepository(productsRepository);

    sut = new GetSalesHistoryUseCase(saleOrdersRepository);
  });

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should be able to get the detailed sales history by period', async () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const products = Array.from({ length: 5 }).map(() =>
      makeProduct({
        price: faker.number.float({ min: 200, max: 500 }),
        inventory: makeInventory({
          stock: faker.number.int({ min: 40, max: 100 }),
          minStock: faker.number.int({ min: 2, max: 10 }),
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
            quantity: faker.number.int({ min: 1, max: 3 }),
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

    const soldProductsInThePeriod = saleOrders.reduce((acc, order) => {
      return acc + order.products.reduce((sum, prod) => sum + prod.quantity, 0);
    }, 0);

    const totalRevenueInThePeriod = saleOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual(
      expect.objectContaining({
        salesHistory: expect.objectContaining({
          startPeriod: new Date('2024-01-01T00:00:00Z'),
          endPeriod: new Date('2024-05-01T00:00:00Z'),
          soldProductsInThePeriod,
          totalRevenueInThePeriod,
          soldProducts: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(UniqueEntityID),
              productName: expect.any(String),
              quantitySold: expect.any(Number),
              totalProfit: expect.any(Number),
              totalRevenue: expect.any(Number),
            }),
          ]),
          topSellingProducts: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(UniqueEntityID),
              productName: expect.any(String),
              quantitySold: expect.any(Number),
              totalProfit: expect.any(Number),
              totalRevenue: expect.any(Number),
            }),
          ]),
        }),
      }),
    );
  });
});
