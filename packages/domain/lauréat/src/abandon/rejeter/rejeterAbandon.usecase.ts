import { Message, MessageHandler, mediator } from 'mediateur';
import { RejeterAbandonCommand } from './rejeterAbandon.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';

export type RejeterAbandonUseCase = Message<
  'REJETER_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    utilisateurValue: string;
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
    utilisateurValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAbandon.abandonRejeté.formatter(),
      dateRejetValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<RejeterAbandonCommand>({
      type: 'REJETER_ABANDON_COMMAND',
      data: {
        dateRejet,
        identifiantProjet,
        réponseSignée,
        utilisateur,
      },
    });
  };
  mediator.register('REJETER_ABANDON_USECASE', runner);
};
