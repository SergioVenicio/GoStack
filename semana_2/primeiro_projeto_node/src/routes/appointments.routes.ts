import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateAppointment from '../services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  const appointments = await repository.find();
  return response.json({
    appointmens: appointments,
  });
});

appointmentsRouter.post('/', async (request, response) => {
  const createService = new CreateAppointment();
  const { date: rawDate, provider_id } = request.body;
  const date = parseISO(rawDate);

  const appointment = await createService.execute({ date, provider_id });
  return response.json(appointment);
});

export default appointmentsRouter;
