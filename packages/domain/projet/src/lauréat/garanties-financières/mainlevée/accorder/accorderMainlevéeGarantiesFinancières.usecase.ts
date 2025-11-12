import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import { IdentifiantProjet } from '../../../..';
import { TypeDocumentRéponseMainlevée } from '../..';

import { AccorderMainlevéeGarantiesFinancièresCommand } from './accorderMainlevéeGarantiesFinancières.command';

export type AccorderMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.AccorderMainlevée',
  {
    identifiantProjetValue: string;
    accordéLeValue: string;
    accordéParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AccorderMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    accordéLeValue,
    accordéParValue,
    réponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const accordéLe = DateTime.convertirEnValueType(accordéLeValue);
    const accordéPar = Email.convertirEnValueType(accordéParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
      accordéLe.formatter(),
      format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AccorderMainlevée',
      data: {
        accordéLe,
        accordéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.AccorderMainlevée', runner);
};
