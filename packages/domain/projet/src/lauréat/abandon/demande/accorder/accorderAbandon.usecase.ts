import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../../index.js';
import { DocumentAbandon } from '../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { AccorderAbandonCommand } from './accorderAbandon.command.js';

export type AccorderAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.AccorderAbandon',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
    rôleUtilisateurValue: string;
  }
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);
    const réponseSignée = DocumentAbandon.abandonAccordé({
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: dateAccord.formatter(),
      réponseSignée: { format },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderAbandonCommand>({
      type: 'Lauréat.Abandon.Command.AccorderAbandon',
      data: {
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
        rôleUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.AccorderAbandon', runner);
};
