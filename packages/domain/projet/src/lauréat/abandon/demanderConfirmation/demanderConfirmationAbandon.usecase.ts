import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentAbandon } from '..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { DemanderConfirmationAbandonCommand } from './demanderConfirmationAbandon.command';

export type DemanderConfirmationAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
  {
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    rôleUtilisateurValue: string;
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
    rôleUtilisateurValue,
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
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

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
        rôleUtilisateur,
      },
    });
  };

  mediator.register('Lauréat.Abandon.UseCase.DemanderConfirmationAbandon', runner);
};
