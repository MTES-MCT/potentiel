import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderAbandonCommand } from './demanderAbandon.command';

type DemanderAbandonUseCaseData = DemanderAbandonCommand['data'];

export type DemanderAbandonUseCase = Message<
  'DEMANDER_ABANDON_USECASE',
  DemanderAbandonUseCaseData
>;

export const registerDemanderAbandonUseCase = () => {
  const runner: MessageHandler<DemanderAbandonUseCase> = async (data) => {
    await mediator.send<DemanderAbandonCommand>({
      type: 'DEMANDER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('DEMANDER_ABANDON_USECASE', runner);
};
