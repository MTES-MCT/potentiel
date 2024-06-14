import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { RejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeterDemandeMainlevéeGarantiesFinancières.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { TypeDocumentRéponseDemandeMainlevée } from '../..';

export type RejeterDemandeMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
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

export const registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<RejeterDemandeMainlevéeGarantiesFinancièresUseCase> = async ({
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
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
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

    await mediator.send<RejeterDemandeMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.RejeterDemandeMainlevée',
      data: {
        rejetéLe,
        rejetéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
    runner,
  );
};
