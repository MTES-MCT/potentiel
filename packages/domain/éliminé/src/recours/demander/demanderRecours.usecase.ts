import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderRecoursCommand } from './demanderRecours.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';

export type DemanderRecoursUseCase = Message<
  'DEMANDER_RECOURS_USECASE',
  {
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue?: {
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
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentRecours.pièceJustificative.formatter(),
          dateDemandeValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }

    await mediator.send<DemanderRecoursCommand>({
      type: 'DEMANDER_RECOURS_COMMAND',
      data: {
        dateDemande,
        raison: raisonValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('DEMANDER_RECOURS_USECASE', runner);
};
