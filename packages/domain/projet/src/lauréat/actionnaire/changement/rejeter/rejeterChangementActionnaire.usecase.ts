import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentActionnaire } from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { RejeterChangementActionnaireCommand } from './rejeterChangementActionnaire.command.js';

export type RejeterChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
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

export const registerRejeterChangementActionnaireUseCase = () => {
  const runner: MessageHandler<RejeterChangementActionnaireUseCase> = async ({
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
      TypeDocumentActionnaire.changementRejeté.formatter(),
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

    await mediator.send<RejeterChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
      data: {
        rejetéLe,
        rejetéPar,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.RejeterDemandeChangement', runner);
};
