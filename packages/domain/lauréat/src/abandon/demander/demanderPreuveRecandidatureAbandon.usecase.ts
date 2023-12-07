import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidatureAbandon.command';

export type DemanderPreuveRecandidatureAbandonUseCase = Message<
  'DEMANDER_PREUVE_RECANDIDATURE_USECASE',
  {
    identifiantProjetValue: string;
    dateDemandeValue: string;
    utilisateurValue: string;
  }
>;

export const registerDemanderPreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<DemanderPreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    dateDemandeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);

    await mediator.send<DemanderPreuveRecandidatureAbandonCommand>({
      type: 'DEMANDER_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        dateDemande,
      },
    });
  };
  mediator.register('DEMANDER_PREUVE_RECANDIDATURE_USECASE', runner);
};
