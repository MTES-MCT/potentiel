import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../../../index.js';
import { DispositifDeStockage, TypeDocumentDispositifDeStockage } from '../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../../document-projet/index.js';

import { EnregistrerChangementDispositifDeStockageCommand } from './enregistrerChangementDispositifDeStockage.command.js';

export type EnregistrerChangementDispositifDeStockageUseCase = Message<
  'Lauréat.Installation.UseCase.EnregistrerChangementDispositifDeStockage',
  {
    identifiantProjetValue: string;
    dispositifDeStockageValue: DispositifDeStockage.RawType;
    enregistréLeValue: string;
    enregistréParValue: string;
    raisonValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementDispositifDeStockageUseCase = () => {
  const handler: MessageHandler<EnregistrerChangementDispositifDeStockageUseCase> = async ({
    identifiantProjetValue,
    enregistréLeValue,
    enregistréParValue,
    dispositifDeStockageValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      TypeDocumentDispositifDeStockage.pièceJustificative.formatter(),
      enregistréLe.formatter(),
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerChangementDispositifDeStockageCommand>({
      type: 'Lauréat.Installation.Command.EnregistrerChangementDispositifDeStockage',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        enregistréLe,
        enregistréPar: Email.convertirEnValueType(enregistréParValue),
        dispositifDeStockage: DispositifDeStockage.convertirEnValueType(dispositifDeStockageValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });
  };

  mediator.register(
    'Lauréat.Installation.UseCase.EnregistrerChangementDispositifDeStockage',
    handler,
  );
};
