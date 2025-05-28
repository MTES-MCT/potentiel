import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { TypeDocumentAbandon } from '..';

import { RejeterAbandonCommand } from './rejeterAbandon.command';

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
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
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
