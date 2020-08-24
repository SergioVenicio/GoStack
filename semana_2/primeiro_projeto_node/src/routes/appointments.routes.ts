import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointment from '../services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const repository = new AppointmentsRepository();
const createService = new CreateAppointment(repository);

appointmentsRouter.get('/', (request, response) => {
  return response.json({ appointments: repository.all() });
});

appointmentsRouter.post('/', (request, response) => {
  const { date: rawDate, provider } = request.body;
  const date = parseISO(rawDate);

  try {
    const appointment = createService.execute({ date, provider });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({
      error: error.message,
    });
  }
});

export default appointmentsRouter;
