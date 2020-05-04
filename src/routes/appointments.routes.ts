import { Router, Request } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

interface RequestProps extends Request {
  io: SocketIOStatic;
  connectedUsers: {};
}

/**
 * Parepositories/AppointmentsRepository um timestamp em date
 * startofhour pega só o horario fechado 00
 * isequal verifica se duas data são iguais
 */

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request: RequestProps, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });
  const ownerSocket = request.connectedUsers[provider_id];
  console.log(ownerSocket);
  if (ownerSocket) {
    request.io.to(ownerSocket).emit('appointment', appointment);
  }

  return response.json(appointment);
});

export default appointmentsRouter;
