import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';
import { TypeDocumentRéponseMainlevée } from '../..';

import { RejeterMainlevéeGarantiesFinancièresCommand } from './rejeterMainlevéeGarantiesFinancières.command';

export type RejeterMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée',
  {
    identifiantProjetValue: string;
    rejetéLeValue: string;
    rejetéParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerRejeterMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<RejeterMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    rejetéLeValue,
    rejetéParValue,
    réponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const rejetéLe = DateTime.convertirEnValueType(rejetéLeValue);
    const rejetéPar = Email.convertirEnValueType(rejetéParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeRejetéeValueType.formatter(),
      rejetéLe.formatter(),
      format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<RejeterMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.RejeterMainlevée',
      data: {
        rejetéLe,
        rejetéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée', runner);
};
