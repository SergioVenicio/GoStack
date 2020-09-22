import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.route';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import errorHandling from '../middlewares/errorHandling';

const router = Router();

router.use('/appointments', appointmentsRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use('/profile', profileRouter);
router.use('/password', passwordRouter);

router.use(errorHandling);

export default router;
