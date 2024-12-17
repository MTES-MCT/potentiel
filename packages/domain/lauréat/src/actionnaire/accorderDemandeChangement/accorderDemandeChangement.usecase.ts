import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentActionnaire } from '..';

import { AccorderDemandeChangementActionnaireCommand } from './accorderDemandeChangement.command';

export type AccorderDemandeChangementActionnaireUseCase = Message<
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

export const registerAccorderDemandeChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AccorderDemandeChangementActionnaireUseCase> = async ({
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

    await mediator.send<AccorderDemandeChangementActionnaireCommand>({
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
