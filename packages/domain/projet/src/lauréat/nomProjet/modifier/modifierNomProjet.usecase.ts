import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { DocumentNomProjet } from '../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { ModifierNomProjetCommand } from './modifierNomProjet.command.js';

export type ModifierNomProjetUseCase = Message<
  'Lauréat.UseCase.ModifierNomProjet',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    nomProjetValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierNomProjetUseCase = () => {
  const handler: MessageHandler<ModifierNomProjetUseCase> = async ({
    identifiantProjetValue,
    nomProjetValue,
    modifiéLeValue,
    modifiéParValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative =
      pièceJustificativeValue &&
      DocumentNomProjet.pièceJustificative({
        identifiantProjet: identifiantProjetValue,
        enregistréLe: modifiéLeValue,
        pièceJustificative: pièceJustificativeValue,
      });

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }
    await mediator.send<ModifierNomProjetCommand>({
      type: 'Lauréat.Command.ModifierNomProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        nomProjet: nomProjetValue,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierNomProjet', handler);
};
