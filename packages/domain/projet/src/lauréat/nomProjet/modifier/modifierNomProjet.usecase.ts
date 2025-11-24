import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentNomProjet } from '../..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { ModifierNomProjetCommand } from './modifierNomProjet.command';

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
      DocumentProjet.convertirEnValueType(
        identifiantProjetValue,
        TypeDocumentNomProjet.pièceJustificative.formatter(),
        modifiéLeValue,
        pièceJustificativeValue.format,
      );
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
