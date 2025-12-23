import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { DispositifDeStockage, TypeDocumentDispositifDeStockage } from '../..';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet';

import { ModifierDispositifDeStockageCommand } from './modifierDispositifDeStockage.command';

export type ModifierDispositifDeStockageUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierDispositifDeStockage',
  {
    identifiantProjetValue: string;
    dispositifDeStockageValue: DispositifDeStockage.RawType;
    modifiéLeValue: string;
    modifiéParValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierDispositifDeStockageUseCase = () => {
  const handler: MessageHandler<ModifierDispositifDeStockageUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    dispositifDeStockageValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentDispositifDeStockage.pièceJustificative.formatter(),
          modifiéLeValue,
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

    await mediator.send<ModifierDispositifDeStockageCommand>({
      type: 'Lauréat.Installation.Command.ModifierDispositifDeStockage',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        dispositifDeStockage: DispositifDeStockage.convertirEnValueType(dispositifDeStockageValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };

  mediator.register('Lauréat.Installation.UseCase.ModifierDispositifDeStockage', handler);
};
