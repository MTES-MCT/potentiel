// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

// Package
import { AccorderAbandonCommand } from './accorderAbandon.command';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';

export type AccorderAbandonUseCase = Message<
  'ACCORDER_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    utilisateurValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async ({
    utilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAbandon.abandonAccordé.formatter(),
      dateAccordValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    // utilisateur.àLaPermission('ACCORDER_ABANDON_USECASE');

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderAbandonCommand>({
      type: 'ACCORDER_ABANDON_COMMAND',
      data: {
        dateAccord,
        utilisateur,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('ACCORDER_ABANDON_USECASE', runner);
};
