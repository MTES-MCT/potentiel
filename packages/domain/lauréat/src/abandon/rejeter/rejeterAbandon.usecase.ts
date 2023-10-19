import { Message, MessageHandler, mediator } from 'mediateur';
import { RejeterAbandonCommand } from './rejeterAbandon.command';

type RejeterAbandonUseCaseData = RejeterAbandonCommand['data'];

export type RejeterAbandonUseCase = Message<'REJETER_ABANDON_USECASE', RejeterAbandonUseCaseData>;

export const registerRejeterAbandonUseCase = () => {
  const runner: MessageHandler<RejeterAbandonUseCase> = async (data) => {
    await mediator.send<RejeterAbandonCommand>({
      type: 'REJETER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('REJETER_ABANDON_USECASE', runner);
};
