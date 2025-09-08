import { faker } from '@faker-js/faker';
import { FakeSender } from 'test/mailer/fake-sender';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let notificationsRepository: InMemoryNotificationsRepository;
let sender: FakeSender;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sender = new FakeSender();
    sut = new SendNotificationUseCase(notificationsRepository, sender);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      emailTo: faker.internet.email(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
    });

    expect(result.isRight()).toBe(true);
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification);
  });
});
