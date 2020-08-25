import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointment from '../services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  const appointments = await repository.find();
  return response.json({
    appointmens: appointments,
  });
});

appointmentsRouter.post('/', async (request, response) => {
  const createService = new CreateAppointment();
  const { date: rawDate, provider } = request.body;
  const date = parseISO(rawDate);

  try {
    const appointment = await createService.execute({ date, provider });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({
      error: error.message,
    });
  }
});

export default appointmentsRouter;
