import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, CorrigerDocumentProjetCommand } from '@potentiel-domain/document';

import * as TypeDocumentDemandeDélai from '../typeDocumentDemandeDélai.valueType';
import { IdentifiantProjet } from '../../../..';

import { CorrigerDemandeDélaiCommand } from './corrigerDemandeDélai.command';

export type CorrigerDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateDemandeValue: string;
    dateCorrectionValue: string;
    nombreDeMoisValue: number;
    raisonValue: string;
    pièceJustificativeValue: {
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
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentDemandeDélai.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

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

    await mediator.send<CorrigerDocumentProjetCommand>({
      type: 'Document.Command.CorrigerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjetKey: pièceJustificative.formatter(),
      },
    });
  };

  mediator.register('Lauréat.Délai.UseCase.CorrigerDemandeDélai', runner);
};
