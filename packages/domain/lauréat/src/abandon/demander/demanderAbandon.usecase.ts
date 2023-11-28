import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderAbandonCommand } from './demanderAbandon.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';

// TODO :
// Pour tout type de demande, il faut vérifier que le CDC le permet une demande via Potentiel
// nous avons besoin du CDC actuel et de l'AO pour vérifier cela

export type DemanderAbandonUseCase = Message<
  'DEMANDER_ABANDON_USECASE',
  {
    dateDemandeValue: string;
    utilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
    raisonValue: string;
    recandidatureValue: boolean;
  }
>;

export const registerDemanderAbandonUseCase = () => {
  const runner: MessageHandler<DemanderAbandonUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    utilisateurValue,
    raisonValue,
    recandidatureValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentAbandon.pièceJustificative.formatter(),
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

    await mediator.send<DemanderAbandonCommand>({
      type: 'DEMANDER_ABANDON_COMMAND',
      data: {
        dateDemande,
        raison: raisonValue,
        recandidature: recandidatureValue,
        identifiantProjet,
        utilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('DEMANDER_ABANDON_USECASE', runner);
};
