import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet, Lauréat } from '../../..';
import { TypeDocumentAbandon } from '..';

import { AccorderAbandonCommand } from './accorderAbandon.command';

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
  }
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async ({
    identifiantUtilisateurValue,
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
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

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
      },
    });

    await mediator.send<Lauréat.GarantiesFinancières.AnnulerTâchesPlanifiéesGarantiesFinancièresCommand>(
      {
        type: 'Lauréat.GarantiesFinancières.Command.AnnulerTâchesPlanifiées',
        data: {
          identifiantProjet,
        },
      },
    );
  };
  mediator.register('Lauréat.Abandon.UseCase.AccorderAbandon', runner);
};
