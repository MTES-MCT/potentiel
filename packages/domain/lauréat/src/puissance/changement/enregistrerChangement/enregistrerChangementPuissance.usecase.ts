import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentPuissance } from '../..';

import { EnregistrerChangementPuissanceCommand } from './enregistrerChangementPuissance.command';

export type EnregistrerChangementPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.EnregistrerChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    puissanceValue: number;
    dateChangementValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementPuissanceUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementPuissanceUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    puissanceValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentPuissance.pièceJustificative.formatter(),
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

    await mediator.send<EnregistrerChangementPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.EnregistrerChangement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        puissance: puissanceValue,
        dateChangement: DateTime.convertirEnValueType(dateChangementValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.Puissance.UseCase.EnregistrerChangement', runner);
};
