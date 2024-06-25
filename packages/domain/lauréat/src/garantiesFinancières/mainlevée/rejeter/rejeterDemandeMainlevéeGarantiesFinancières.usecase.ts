import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentRéponseDemandeMainlevée } from '../..';

import { RejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeterDemandeMainlevéeGarantiesFinancières.command';

export type RejeterDemandeMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
  {
    identifiantProjetValue: string;
    rejetéeLeValue: string;
    rejetéeParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<RejeterDemandeMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    rejetéeLeValue,
    rejetéeParValue,
    réponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const rejetéeLe = DateTime.convertirEnValueType(rejetéeLeValue);
    const rejetéePar = Email.convertirEnValueType(rejetéeParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
      rejetéeLe.formatter(),
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
        rejetéeLe,
        rejetéePar,
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
