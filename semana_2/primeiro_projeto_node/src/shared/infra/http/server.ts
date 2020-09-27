import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import { errors } from 'celebrate';

import cors from 'cors';

import routes from './routes';
import uploadCondif from '@config/upload';

import rateLimiter from '../http/middlewares/rateLimiter';

const PORT = 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadCondif.upload_directory));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.listen(PORT, () => {
  console.log(`[APP] running ON :${PORT}`);
});
