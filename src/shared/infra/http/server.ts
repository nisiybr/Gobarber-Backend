import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';

import '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';
import '@shared/container';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

// middleware de erro tem 4 parametros
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Erro conhecido, gerado pelo AppError, ou seja, gerado pela minha aplicação
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Backend is flying now! Goooo! Goooo!');
});
