import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.route';

import errorHandling from '../middlewares/errorHandling';

const router = Router();

router.use('/appointments', appointmentsRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);

router.use(errorHandling);

export default router;
