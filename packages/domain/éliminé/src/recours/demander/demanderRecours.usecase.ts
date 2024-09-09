import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';

import { DemanderRecoursCommand } from './demanderRecours.command';

export type DemanderRecoursUseCase = Message<
  'Eliminé.Recours.UseCase.DemanderRecours',
  {
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

export const registerDemanderRecoursUseCase = () => {
  const runner: MessageHandler<DemanderRecoursUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRecours.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<DemanderRecoursCommand>({
      type: 'Eliminé.Recours.Command.DemanderRecours',
      data: {
        dateDemande,
        raison: raisonValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('Eliminé.Recours.UseCase.DemanderRecours', runner);
};
