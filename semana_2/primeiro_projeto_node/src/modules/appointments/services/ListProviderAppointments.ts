import { inject, injectable } from 'tsyringe';

import IAppointmentsReporitory from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProviders/models/ICacheProvider';

import Appointment from '../infra/typeorm/entities/Appointment';
import { classToClass } from 'class-transformer';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointments {
  private _repository: IAppointmentsReporitory;
  private _cache: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository') repository: IAppointmentsReporitory,
    @inject('CacheProvider') cache: ICacheProvider
  ) {
    this._repository = repository;
    this._cache = cache;
  }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const params = `${provider_id}:${year}-${month}-${day}`;
    const cacheKey = `provider-appointments:${params}`;
    const cacheData = await this._cache.recover<Appointment[]>(cacheKey);

    if (cacheData) return cacheData as Appointment[];

    const newData = await this._repository.findAllInDay({
      provider_id,
      day,
      month,
      year,
    });

    await this._cache.save<Appointment[]>(cacheKey, classToClass(newData));

    return newData;
  }
}
