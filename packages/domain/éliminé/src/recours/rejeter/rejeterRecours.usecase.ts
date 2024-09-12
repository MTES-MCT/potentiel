import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';

import { RejeterRecoursCommand } from './rejeterRecours.command';

export type RejeterRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.RejeterRecours',
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

export const registerRejeterRecoursUseCase = () => {
  const runner: MessageHandler<RejeterRecoursUseCase> = async ({
    dateRejetValue,
    identifiantProjetValue,
    réponseSignéeValue: { content, format },
    identifiantUtilisateurValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRecours.recoursRejeté.formatter(),
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

    await mediator.send<RejeterRecoursCommand>({
      type: 'Éliminé.Recours.Command.RejeterRecours',
      data: {
        dateRejet,
        identifiantProjet,
        réponseSignée,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Éliminé.Recours.UseCase.RejeterRecours', runner);
};
