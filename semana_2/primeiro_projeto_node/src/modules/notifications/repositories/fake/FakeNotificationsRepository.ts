import { ObjectId } from 'mongodb';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const newAppointment = new Notification();

    Object.assign(newAppointment, {
      id: new ObjectId(),
      recipient_id,
      content,
    });

    this.notifications.push(newAppointment);
    return newAppointment;
  }
}

export default FakeNotificationsRepository;
