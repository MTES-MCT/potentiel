import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentActionnaire } from '../..';
import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet';

import { AccorderChangementActionnaireCommand } from './accorderChangementActionnairet.command';

export type AccorderChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
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

export const registerAccorderChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AccorderChangementActionnaireUseCase> = async ({
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
      TypeDocumentActionnaire.changementAccordé.formatter(),
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

    await mediator.send<AccorderChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
      data: {
        accordéLe,
        accordéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.AccorderDemandeChangement', runner);
};
