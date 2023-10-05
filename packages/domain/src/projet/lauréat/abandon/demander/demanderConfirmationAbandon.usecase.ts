import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonCommand } from '../abandon.command';
import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';

type DemanderConfirmationAbandonUseCaseData = DemanderConfirmationAbandonCommand['data'];

export type DemanderConfirmationAbandonUseCase = Message<
  'DEMANDER_CONFIRMATION_ABANDON_USECASE',
  DemanderConfirmationAbandonUseCaseData
>;

export const registerDemanderConfirmationAbandonUseCase = () => {
  const runner: MessageHandler<DemanderConfirmationAbandonUseCase> = async (data) => {
    await mediator.send<AbandonCommand>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_USECASE', runner);
};
