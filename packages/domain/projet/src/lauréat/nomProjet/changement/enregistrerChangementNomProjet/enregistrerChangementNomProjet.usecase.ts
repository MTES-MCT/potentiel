import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentLauréat } from '../../..';
import { IdentifiantProjet } from '../../../..';

import { EnregistrerChangementNomProjetCommand } from './enregistrerChangementNomProjet.command';

export type EnregistrerChangementNomProjetUseCase = Message<
  'Lauréat.UseCase.EnregistrerChangementNomProjet',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomProjetValue: string;
    dateChangementValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementNomProjetUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementNomProjetUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomProjetValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentLauréat.pièceJustificative.formatter(),
          dateChangementValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }

    await mediator.send<EnregistrerChangementNomProjetCommand>({
      type: 'Lauréat.Command.EnregistrerChangementNomProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomProjet: nomProjetValue,
        dateChangement: DateTime.convertirEnValueType(dateChangementValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.UseCase.EnregistrerChangementNomProjet', runner);
};
