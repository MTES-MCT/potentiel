import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentActionnaire } from '../..';

import { AccorderDemandeChangementActionnaireCommand } from './accorderChangementActionnairet.command';

export type AccorderDemandeChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
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

export const registerAccorderDemandeChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AccorderDemandeChangementActionnaireUseCase> = async ({
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

    await mediator.send<AccorderDemandeChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
      data: {
        accordéeLe,
        accordéePar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.AccorderDemandeChangement', runner);
};
