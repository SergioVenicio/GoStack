import express from 'express';
import 'express-async-errors';

import 'reflect-metadata';
import '@shared/infra/typeorm';
import '@shared/container';

import cors from 'cors';

import routes from './routes';
import uploadCondif from '@config/upload';

const PORT = 3333;
const app = express();
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadCondif.directory));
app.use(routes);

app.listen(PORT, () => {
  console.log(`[APP] running ON :${PORT}`);
});
