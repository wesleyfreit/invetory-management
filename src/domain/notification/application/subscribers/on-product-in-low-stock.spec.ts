import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { makeProduct } from 'test/factories/make-product';
import { FakeSender } from 'test/mailer/fake-sender';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { OnProductInLowStock } from './on-product-in-low-stock';

let productsRepository: InMemoryProductsRepository;
let notificationsRepository: InMemoryNotificationsRepository;

let sender: FakeSender;

let sut: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Product In Low Stock', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    notificationsRepository = new InMemoryNotificationsRepository();

    sender = new FakeSender();

    sut = new SendNotificationUseCase(notificationsRepository, sender);

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute');

    new OnProductInLowStock(sut);
  });

  it('should send a notification when a product is in low stock', async () => {
    const product = makeProduct({
      stock: 10,
      minStock: 2,
    });

    await productsRepository.create(product);

    product.decreaseStock(9);

    await productsRepository.save(product);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
