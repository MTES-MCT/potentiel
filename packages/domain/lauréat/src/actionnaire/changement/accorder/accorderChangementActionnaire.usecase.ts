import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentActionnaire } from '../..';

import { AccorderChangementActionnaireCommand } from './accorderChangementActionnairet.command';

export type AccorderChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.AccorderChangement',
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

export const registerAccorderChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AccorderChangementActionnaireUseCase> = async ({
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
      TypeDocumentActionnaire.changementAccordé.formatter(),
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

    await mediator.send<AccorderChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.AccorderChangement',
      data: {
        accordéeLe,
        accordéePar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.AccorderChangement', runner);
};
