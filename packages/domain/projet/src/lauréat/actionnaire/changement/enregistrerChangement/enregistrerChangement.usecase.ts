import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentActionnaire } from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
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
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentActionnaire.pièceJustificative.formatter(),
      dateChangementValue,
      pièceJustificativeValue.format,
    );

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
