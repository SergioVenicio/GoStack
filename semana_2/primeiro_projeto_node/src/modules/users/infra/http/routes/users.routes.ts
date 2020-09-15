import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AvatarController from '../controllers/AvatarController';

const usersRouter = Router();
const controller = new UsersController();
const avatarsController = new AvatarController();
const upload = multer(uploadConfig);

usersRouter.post('/', controller.create);
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  avatarsController.update
);

export default usersRouter;
