import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentProducteur, NuméroIdentification } from '../../index.js';
import type { CorrigerNuméroIdentificationCommand } from './corrigerNuméroIdentification.command.js';

export type CorrigerNuméroIdentificationUseCase = Message<
  'Lauréat.Producteur.UseCase.CorrigerNuméroIdentification',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateCorrectionValue: string;
    numéroIdentificationValue: { siren?: string; siret?: string };
    raisonValue?: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerCorrigerNuméroIdentificationUseCase = () => {
  const handler: MessageHandler<CorrigerNuméroIdentificationUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateCorrectionValue,
    pièceJustificativeValue,
    raisonValue,
    numéroIdentificationValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateCorrection = DateTime.convertirEnValueType(dateCorrectionValue);
    const numéroIdentification = NuméroIdentification.bind(numéroIdentificationValue);

    const pièceJustificative = DocumentProducteur.numéroIdentificationCorrigé({
      identifiantProjet: identifiantProjet.formatter(),
      corrigéLe: dateCorrection.formatter(),
      pièceJustificative: pièceJustificativeValue,
    });

    await mediator.send<CorrigerNuméroIdentificationCommand>({
      type: 'Lauréat.Producteur.Command.CorrigerNuméroIdentification',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateCorrection,
        pièceJustificative,
        raison: raisonValue,
        numéroIdentification,
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

  mediator.register('Lauréat.Producteur.UseCase.CorrigerNuméroIdentification', handler);
};
