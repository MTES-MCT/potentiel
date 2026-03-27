import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentDélai } from '../../index.js';

import { DemanderDélaiCommand } from './demanderDélai.command.js';

export type DemanderDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.DemanderDélai',
  {
    nombreDeMoisValue: number;
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    raisonValue: string;
  }
>;

export const registerDemanderDélaiDélaiUseCase = () => {
  const runner: MessageHandler<DemanderDélaiUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue: { content, format },
    identifiantUtilisateurValue,
    raisonValue,
    nombreDeMoisValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentDélai.pièceJustificative({
      identifiantProjet: identifiantProjet.formatter(),
      demandéLe: dateDemandeValue,
      pièceJustificative: {
        format,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<DemanderDélaiCommand>({
      type: 'Lauréat.Délai.Command.DemanderDélai',
      data: {
        dateDemande,
        raison: raisonValue,
        nombreDeMois: nombreDeMoisValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Délai.UseCase.DemanderDélai', runner);
};
