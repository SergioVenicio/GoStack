import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationRepository from '../../../repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

export default class NotificationsRepository
  implements INotificationRepository {
  private _repository: MongoRepository<Notification>;

  constructor() {
    this._repository = getMongoRepository(Notification, 'mongodb');
  }

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this._repository.create({
      recipient_id,
      content,
    });
    await this._repository.save(notification);

    return notification;
  }
}
