import express from 'express';
import 'express-async-errors';

import 'reflect-metadata';
import './database';

import routes from './routes';
import uploadCondif from './config/upload';

const PORT = 3333;
const app = express();

app.use(express.json());
app.use('/files', express.static(uploadCondif.directory));
app.use(routes);

app.listen(PORT, () => {
  console.log(`[APP] running ON :${PORT}`);
});
