import { Either, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { Sender } from '../mailer/sender';
import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
  emailTo: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private sender: Sender,
  ) {}

  async execute({
    emailTo,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    await this.sender.sendNotification({
      to: emailTo,
      subject: title,
      text: content,
    });

    return right({
      notification,
    });
  }
}
