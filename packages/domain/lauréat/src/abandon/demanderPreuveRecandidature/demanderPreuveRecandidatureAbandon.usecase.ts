import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AjouterTâcheCommand } from '@potentiel-domain/tache';

import * as TypeTâcheAbandon from '../typeTâcheAbandon.valueType';

import { DemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidatureAbandon.command';

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
      type: 'System.Tâche.Command.AjouterTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâcheAbandon.transmettrePreuveRecandidature.type,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon', runner);
};
