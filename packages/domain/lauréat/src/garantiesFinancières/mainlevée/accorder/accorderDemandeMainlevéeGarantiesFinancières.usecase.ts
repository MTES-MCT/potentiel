import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentRéponseDemandeMainlevée } from '../..';

import { AccorderDemandeMainlevéeGarantiesFinancièresCommand } from './accorderDemandeMainlevéeGarantiesFinancières.command';

export type AccorderDemandeMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
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

export const registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AccorderDemandeMainlevéeGarantiesFinancièresUseCase> = async ({
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
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
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

    await mediator.send<AccorderDemandeMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
      data: {
        accordéLe,
        accordéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
    runner,
  );
};
