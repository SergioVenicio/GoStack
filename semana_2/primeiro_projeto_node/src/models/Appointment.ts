import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface AppointmentInterface {
  id?: string;
  provider: string;
  date: Date;
}

@Entity('appointments')
export default class Appointment implements AppointmentInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column('timestamp with time zone')
  date: Date;
}
