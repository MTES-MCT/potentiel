import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentRéponseDemandeMainlevée } from '../..';

import { AccorderDemandeMainlevéeGarantiesFinancièresCommand } from './accorderDemandeMainlevéeGarantiesFinancières.command';

export type AccorderDemandeMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
  {
    identifiantProjetValue: string;
    accordéeLeValue: string;
    accordéeParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AccorderDemandeMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    accordéeLeValue,
    accordéeParValue,
    réponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const accordéeLe = DateTime.convertirEnValueType(accordéeLeValue);
    const accordéePar = Email.convertirEnValueType(accordéeParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
      accordéeLe.formatter(),
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
        accordéeLe,
        accordéePar,
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
