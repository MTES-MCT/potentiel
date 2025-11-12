import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';
import { ArchiverÉliminéCommand } from '../../archiver/archiverÉliminé.command';
import { DocumentProjet, IdentifiantProjet } from '../../..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { AccorderRecoursCommand } from './accorderRecours.command';

export type AccorderRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.AccorderRecours',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderRecoursUseCase = () => {
  const runner: MessageHandler<AccorderRecoursUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      TypeDocumentRecours.recoursAccordé.formatter(),
      dateAccord.formatter(),
      format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderRecoursCommand>({
      type: 'Éliminé.Recours.Command.AccorderRecours',
      data: {
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
      },
    });

    await mediator.send<ArchiverÉliminéCommand>({
      type: 'Éliminé.Recours.Command.ArchiverÉliminé',
      data: {
        dateArchive: dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };
  mediator.register('Éliminé.Recours.UseCase.AccorderRecours', runner);
};
