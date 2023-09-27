import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderAbandonCommand } from './demanderAbandon.command';
import { AbandonCommand } from '../abandon.command';

type DemanderAbandonUseCaseData = DemanderAbandonCommand['data'];

export type DemanderAbandonAvecRecandidatureUseCase = Message<
  'DEMANDER_ABANDON_USECASE',
  DemanderAbandonUseCaseData
>;

export const registerDemanderAbandonAvecRecandidatureUseCase = () => {
  const runner: MessageHandler<DemanderAbandonAvecRecandidatureUseCase> = async ({
    identifiantProjet,
    piéceJustificative,
    raison,
    dateAbandon,
    recandidature,
  }) => {
    await mediator.send<AbandonCommand>({
      type: 'DEMANDER_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        piéceJustificative,
        raison,
        dateAbandon,
        recandidature,
      },
    });
  };
  mediator.register('DEMANDER_ABANDON_USECASE', runner);
};
