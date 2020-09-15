import { Router } from 'express';

import AppointmensController from '@modules/appointments/infra/http/controllers/AppotmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const controller = new AppointmensController();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', controller.list);

appointmentsRouter.post('/', controller.create);

export default appointmentsRouter;
