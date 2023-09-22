import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderAbandonAvecRecandidatureCommand } from './demanderAbandonAvecRecandidature.command';
import { AbandonCommand } from '../abandon.command';

type DemanderAbandonAvecRecandidatureUseCaseData = DemanderAbandonAvecRecandidatureCommand['data'];

export type DemanderAbandonAvecRecandidatureUseCase = Message<
  'DEMANDER_ABANDON_AVEC_RECANDIDATURE_USECASE',
  DemanderAbandonAvecRecandidatureUseCaseData
>;

export const registerDemanderAbandonAvecRecandidatureUseCase = () => {
  const runner: MessageHandler<DemanderAbandonAvecRecandidatureUseCase> = async ({
    identifiantProjet,
    piéceJustificative,
    raisonAbandon,
  }) => {
    await mediator.send<AbandonCommand>({
      type: 'DEMANDER_ABANDON_AVEC_RECANDIDATURE_COMMAND',
      data: {
        identifiantProjet,
        piéceJustificative,
        raisonAbandon,
      },
    });
  };
  mediator.register('DEMANDER_ABANDON_AVEC_RECANDIDATURE_USECASE', runner);
};
