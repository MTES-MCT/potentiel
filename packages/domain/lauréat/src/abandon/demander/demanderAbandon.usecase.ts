import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderAbandonCommand } from './demanderAbandon.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

export type DemanderAbandonUseCase = Message<
  'DEMANDER_ABANDON_USECASE',
  {
    dateDemandeValue: string;
    utilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
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
    pièceJustificativeValue: { format, content },
    utilisateurValue,
    raisonValue,
    recandidatureValue,
  }) => {
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      'abandon/pièce-justificative',
      dateDemandeValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: pièceJustificative,
      },
    });

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
