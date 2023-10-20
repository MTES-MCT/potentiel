import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

export type DemanderConfirmationAbandonUseCase = Message<
  'DEMANDER_CONFIRMATION_ABANDON_USECASE',
  {
    dateDemandeValue: string;
    utilisateurValue: string;
    identifiantProjetValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerDemanderConfirmationAbandonUseCase = () => {
  const runner: MessageHandler<DemanderConfirmationAbandonUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    réponseSignéeValue: { content, format },
    utilisateurValue,
  }) => {
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      'abandon/abandon-à-confirmer',
      dateDemandeValue,
      format,
    );
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<DemanderConfirmationAbandonCommand>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
      data: {
        dateDemande,
        identifiantProjet,
        réponseSignée,
        utilisateur,
      },
    });
  };

  mediator.register('DEMANDER_CONFIRMATION_ABANDON_USECASE', runner);
};
