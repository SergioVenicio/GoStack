import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AppointmensController from '@modules/appointments/infra/http/controllers/AppotmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

const controller = new AppointmensController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.get('/', controller.index);
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.string().required(),
    },
  }),
  controller.create
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
