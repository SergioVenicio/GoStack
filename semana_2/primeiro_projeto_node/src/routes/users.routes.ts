import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { UserInterface } from '../models/User';
import CreateUser from '../services/CreateUser';
import AvatarUpload from '../services/AvatarUpload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const service = new CreateUser();
  const { name, email, password } = <UserInterface>request.body;
  const user = await service.execute({ name, email, password });

  return response.json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const service = new AvatarUpload();
    const { filename, mimetype } = request.file;
    const { id } = request.user;

    const user = await service.execute({ user_id: id, filename, mimetype });
    return response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
);

export default usersRouter;
