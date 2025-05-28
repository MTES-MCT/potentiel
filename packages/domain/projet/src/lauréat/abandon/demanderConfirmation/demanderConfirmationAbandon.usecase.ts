import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../..';
import { TypeDocumentAbandon } from '..';

import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';

export type DemanderConfirmationAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
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
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<DemanderConfirmationAbandonCommand>({
      type: 'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
      data: {
        dateDemande,
        identifiantProjet,
        réponseSignée,
        identifiantUtilisateur,
      },
    });
  };

  mediator.register('Lauréat.Abandon.UseCase.DemanderConfirmationAbandon', runner);
};
