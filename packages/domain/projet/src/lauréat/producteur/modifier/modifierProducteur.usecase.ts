import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentProducteur } from '..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { ModifierProducteurCommand } from './modifierProducteur.command';

export type ModifierProducteurUseCase = Message<
  'Lauréat.Producteur.UseCase.ModifierProducteur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    producteurValue: string;
    dateModificationValue: string;
    raisonValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierProducteurUseCase = () => {
  const runner: MessageHandler<ModifierProducteurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    producteurValue,
    dateModificationValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentProducteur.pièceJustificative.formatter(),
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

    await mediator.send<ModifierProducteurCommand>({
      type: 'Lauréat.Producteur.Command.ModifierProducteur',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        producteur: producteurValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Producteur.UseCase.ModifierProducteur', runner);
};
