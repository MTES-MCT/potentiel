import { Message, MessageHandler, mediator } from 'mediateur';
import { AccorderAbandonCommand } from './accorderAbandon.command';
import { AbandonCommand } from '../abandon.command';

type AccorderAbandonUseCaseData = AccorderAbandonCommand['data'];

export type AccorderAbandonUseCase = Message<
  'ACCORDER_ABANDON_USECASE',
  AccorderAbandonUseCaseData
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async (data) => {
    await mediator.send<AbandonCommand>({
      type: 'ACCORDER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('ACCORDER_ABANDON_USECASE', runner);
};
