import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { DocumentProducteur, NuméroImmatriculation } from '../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { ModifierProducteurCommand } from './modifierProducteur.command.js';

export type ModifierProducteurUseCase = Message<
  'Lauréat.Producteur.UseCase.ModifierProducteur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    producteurValue: string;
    dateModificationValue: string;
    numéroImmatriculationValue?: {
      siren?: string;
      siret?: string;
    };
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
    numéroImmatriculationValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProducteur.pièceJustificative({
          identifiantProjet: identifiantProjetValue,
          enregistréLe: dateModificationValue,
          pièceJustificative: pièceJustificativeValue,
        })
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
        numéroImmatriculation: numéroImmatriculationValue
          ? NuméroImmatriculation.convertirEnValueType(numéroImmatriculationValue)
          : undefined,
      },
    });
  };
  mediator.register('Lauréat.Producteur.UseCase.ModifierProducteur', runner);
};
