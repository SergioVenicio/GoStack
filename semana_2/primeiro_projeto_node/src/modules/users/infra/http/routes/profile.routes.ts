import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const controller = new ProfileController();

profileRouter.get('/', controller.get);
profileRouter.put('/', controller.update);

export default profileRouter;
