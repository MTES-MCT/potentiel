import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { RejeterAbandonCommand } from './rejeterAbandon.command';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';

export type RejeterAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.RejeterAbandon',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRejetValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerRejeterAbandonUseCase = () => {
  const runner: MessageHandler<RejeterAbandonUseCase> = async ({
    dateRejetValue,
    identifiantProjetValue,
    réponseSignéeValue: { content, format },
    identifiantUtilisateurValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAbandon.abandonRejeté.formatter(),
      dateRejetValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
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

    await mediator.send<RejeterAbandonCommand>({
      type: 'Lauréat.Abandon.Command.RejeterAbandon',
      data: {
        dateRejet,
        identifiantProjet,
        réponseSignée,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.RejeterAbandon', runner);
};
