import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentPuissance } from '..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { ModifierPuissanceCommand } from './modifierPuissance.command';

export type ModifierPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.ModifierPuissance',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    puissanceValue: number;
    puissanceDeSiteValue?: number;
    dateModificationValue: string;
    raisonValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierPuissanceUseCase = () => {
  const runner: MessageHandler<ModifierPuissanceUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    puissanceValue,
    puissanceDeSiteValue,
    dateModificationValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentPuissance.pièceJustificative.formatter(),
          dateModificationValue,
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

    await mediator.send<ModifierPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.ModifierPuissance',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        puissance: puissanceValue,
        puissanceDeSite: puissanceDeSiteValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Puissance.UseCase.ModifierPuissance', runner);
};
