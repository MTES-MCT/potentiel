import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as TypeDocumentDemandeDélai from '../typeDocumentDemandeDélai.valueType.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { CorrigerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { CorrigerDemandeDélaiCommand } from './corrigerDemandeDélai.command.js';

export type CorrigerDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateDemandeValue: string;
    dateCorrectionValue: string;
    nombreDeMoisValue: number;
    raisonValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerCorrigerDemandeDélaiUseCase = () => {
  const runner: MessageHandler<CorrigerDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateDemandeValue,
    dateCorrectionValue,
    nombreDeMoisValue: nombreDeMois,
    raisonValue: raison,
    pièceJustificativeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateCorrection = DateTime.convertirEnValueType(dateCorrectionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentDemandeDélai.pièceJustificative.formatter(),
          dateDemandeValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    await mediator.send<CorrigerDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.CorrigerDemandeDélai',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateCorrection,
        nombreDeMois,
        raison,
        pièceJustificative,
      },
    });

    if (pièceJustificativeValue) {
      await mediator.send<CorrigerDocumentProjetCommand>({
        type: 'Document.Command.CorrigerDocumentProjet',
        data: {
          content: pièceJustificativeValue.content,
          documentProjetKey: pièceJustificative!.formatter(),
        },
      });
    }
  };

  mediator.register('Lauréat.Délai.UseCase.CorrigerDemandeDélai', runner);
};
