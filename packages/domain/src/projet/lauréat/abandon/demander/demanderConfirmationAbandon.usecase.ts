import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonCommand } from '../abandon.command';
import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';

type DemanderConfirmationAbandonUseCaseData = DemanderConfirmationAbandonCommand['data'];

export type DemanderConfirmationAbandonUseCase = Message<
  'DEMANDER_ABANDON_USECASE',
  DemanderConfirmationAbandonUseCaseData
>;

export const registerDemanderConfirmationAbandonUseCase = () => {
  const runner: MessageHandler<DemanderConfirmationAbandonUseCase> = async ({
    identifiantProjet,
    dateDemandeConfirmationAbandon,
    réponseSignée,
  }) => {
    await mediator.send<AbandonCommand>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        dateDemandeConfirmationAbandon,
        réponseSignée,
      },
    });
  };
  mediator.register('DEMANDER_ABANDON_USECASE', runner);
};
