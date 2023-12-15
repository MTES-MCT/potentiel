import { Message, MessageHandler, mediator } from 'mediateur';
import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';

export type DemanderConfirmationAbandonUseCase = Message<
  'DEMANDER_CONFIRMATION_ABANDON_USECASE',
  {
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
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
    identifiantUtilisateurValue,
  }) => {
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAbandon.abandonÀConfirmer.formatter(),
      dateDemandeValue,
      format,
    );
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

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
        identifiantUtilisateur,
      },
    });
  };

  mediator.register('DEMANDER_CONFIRMATION_ABANDON_USECASE', runner);
};
