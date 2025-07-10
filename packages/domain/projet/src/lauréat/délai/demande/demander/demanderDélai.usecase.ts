import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentDemandeDélai } from '../..';
import { IdentifiantProjet } from '../../../..';

import { DemanderDélaiCommand } from './demanderDélai.command';

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
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
    nombreDeMoisValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentDemandeDélai.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue!.content,
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
