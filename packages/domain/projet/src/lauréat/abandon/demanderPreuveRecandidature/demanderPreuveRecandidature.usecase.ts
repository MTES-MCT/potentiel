import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { DemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature.command.js';

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
  };
  mediator.register('Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon', runner);
};
