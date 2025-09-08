import { Sender, SenderProps } from '@/domain/notification/application/mailer/sender';
import { faker } from '@faker-js/faker';

export function makeSender(data: string[]) {
  // This function simulates the creation of a sender object
  return {
    accepted: [data[1] || ''],
    rejected: [],
    response: '250 OK',
    envelope: {
      from: faker.internet.email(),
      to: [data[1] || ''],
    },
    pending: [],
    messageId: `<${faker.string.uuid()}@${faker.person.firstName()}>`,
  };
}

export class FakeSender implements Sender {
  async sendNotification(props: SenderProps): Promise<void> {
    // Simulate sending an email without actually doing it
    // This is a no-op for testing purposes
    // Logic can add here to check if the method was called, if needed
    JSON.stringify(props);
  }
}
