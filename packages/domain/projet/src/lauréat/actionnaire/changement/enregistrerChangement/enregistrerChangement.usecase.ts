import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentActionnaire } from '../../index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { EnregistrerChangementActionnaireCommand } from './enregistrerChangement.command.js';

export type EnregistrerChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    actionnaireValue: string;
    dateChangementValue: string;
    raisonValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementActionnaireUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementActionnaireUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    actionnaireValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const pièceJustificative = DocumentActionnaire.pièceJustificative({
      identifiantProjet: identifiantProjetValue,
      demandéLe: dateChangementValue,
      pièceJustificative: pièceJustificativeValue,
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue!.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<EnregistrerChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.EnregistrerChangement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateChangement: DateTime.convertirEnValueType(dateChangementValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.EnregistrerChangement', runner);
};
