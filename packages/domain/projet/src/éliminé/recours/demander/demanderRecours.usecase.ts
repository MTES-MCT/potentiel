import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../document-projet';
import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';
import { IdentifiantProjet } from '../../..';

import { DemanderRecoursCommand } from './demanderRecours.command';

export type DemanderRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.DemanderRecours',
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
      identifiantProjet.formatter(),
      TypeDocumentRecours.pièceJustificative.formatter(),
      dateDemande.formatter(),
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
      type: 'Éliminé.Recours.Command.DemanderRecours',
      data: {
        dateDemande,
        raison: raisonValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('Éliminé.Recours.UseCase.DemanderRecours', runner);
};
