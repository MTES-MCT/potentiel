import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentActionnaire } from '../..';

import { RejeterChangementActionnaireCommand } from './rejeterChangementActionnaire.command';

export type RejeterChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
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

export const registerRejeterChangementActionnaireUseCase = () => {
  const runner: MessageHandler<RejeterChangementActionnaireUseCase> = async ({
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
      TypeDocumentActionnaire.changementRejeté.formatter(),
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

    await mediator.send<RejeterChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
      data: {
        rejetéeLe,
        rejetéePar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.RejeterDemandeChangement', runner);
};
