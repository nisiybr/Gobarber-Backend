import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import io from 'socket.io';
import http from 'http';

import 'express-async-errors';

import routes from './routes';
import 'reflect-metadata';
import './database';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

interface RequestProps extends Request {
  io: SocketIOStatic;
  connectedUsers: {};
}

interface connectedUser {
  userId: string;
}

const connectedUsers = {};

const app = express();
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));

/**
 * extraindo o http do app
 */
const server = http.createServer(app);

/**
 * Criando uma instacia do server
 */
const websocket = io(server);

/**
 * Listener de connection cria um hash identificador de cliente
 */
websocket.on('connection', socket => {
  /** Na hora de estabelecer a conexao entre o cliente e o servidor e possivel passar atributos adicionais */
  const { userId } = socket.handshake.query;

  connectedUsers[userId] = socket.id;
  socket.on('disconnect', () => {
    delete connectedUsers[userId];
  });
});

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use((request: RequestProps, response: Response, next: NextFunction) => {
  request.io = websocket;
  request.connectedUsers = connectedUsers;
  next();
});
app.use(routes);

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

server.listen(3333, () => {
  console.log('🚀 Backend is flying now!');
});
