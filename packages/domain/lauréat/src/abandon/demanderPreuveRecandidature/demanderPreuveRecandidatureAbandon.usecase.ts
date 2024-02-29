import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidatureAbandon.command';
import { AjouterTâcheCommand, TypeTâche } from '@potentiel-domain/tache';

export type DemanderPreuveRecandidatureAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
  {
    identifiantProjetValue: string;
    dateDemandeValue: string;
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
      type: 'System.Lauréat.Abandon.Command.DemanderPreuveRecandidatureAbandon',
      data: {
        identifiantProjet,
        dateDemande,
      },
    });

    await mediator.send<AjouterTâcheCommand>({
      type: 'Tâche.Command.AjouterTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâche.abandonTransmettrePreuveRecandidature,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon', runner);
};
