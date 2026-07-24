import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../index.js';
import { DocumentRecours } from '../index.js';
import type { AccorderRecoursCommand } from './accorderRecours.command.js';

export type AccorderRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.AccorderRecours',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateRéponseSignéeValue: string;
    accordéLeValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderRecoursUseCase = () => {
  const runner: MessageHandler<AccorderRecoursUseCase> = async ({
    identifiantUtilisateurValue,
    dateRéponseSignéeValue,
    accordéLeValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRéponseSignée = DateTime.convertirEnValueType(dateRéponseSignéeValue);
    const accordéLe = DateTime.convertirEnValueType(accordéLeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const réponseSignée = DocumentRecours.recoursAccordé({
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: accordéLe.formatter(),
      réponseSignée: { format },
    });

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
        dateRéponseSignée,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
        accordéLe,
      },
    });
  };
  mediator.register('Éliminé.Recours.UseCase.AccorderRecours', runner);
};
