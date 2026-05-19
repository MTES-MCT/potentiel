import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../index.js';
import { DocumentProducteur, NuméroIdentification } from '../index.js';
import type { ModifierProducteurCommand } from './modifierProducteur.command.js';

export type ModifierProducteurUseCase = Message<
  'Lauréat.Producteur.UseCase.ModifierProducteur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    producteurValue: string;
    dateModificationValue: string;
    numéroIdentificationValue?: {
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
    numéroIdentificationValue,
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
        numéroIdentification: numéroIdentificationValue
          ? NuméroIdentification.bind(numéroIdentificationValue)
          : undefined,
      },
    });
  };
  mediator.register('Lauréat.Producteur.UseCase.ModifierProducteur', runner);
};
