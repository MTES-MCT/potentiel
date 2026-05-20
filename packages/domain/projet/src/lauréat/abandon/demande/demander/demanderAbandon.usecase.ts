import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentAbandon } from '../../index.js';
import type { DemanderAbandonCommand } from './demanderAbandon.command.js';

export type DemanderAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.DemanderAbandon',
  {
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    raisonValue: string;
    PPASignaléValue?: true;
  }
>;

export const registerDemanderAbandonUseCase = () => {
  const runner: MessageHandler<DemanderAbandonUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
    PPASignaléValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentAbandon.pièceJustificative({
      identifiantProjet: identifiantProjetValue,
      demandéLe: dateDemandeValue,
      pièceJustificative: pièceJustificativeValue,
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<DemanderAbandonCommand>({
      type: 'Lauréat.Abandon.Command.DemanderAbandon',
      data: {
        dateDemande,
        raison: raisonValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
        PPASignalé: PPASignaléValue,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.DemanderAbandon', runner);
};
