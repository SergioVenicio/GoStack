import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const controller = new ProfileController();

profileRouter.get('/', controller.get);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().min(6),
      password_confirmation: Joi.string().optional().valid(Joi.ref('password')),
    },
  }),
  controller.update
);

export default profileRouter;
