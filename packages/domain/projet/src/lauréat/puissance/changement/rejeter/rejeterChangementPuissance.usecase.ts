import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentPuissance } from '../..';
import { IdentifiantProjet } from '../../../..';

import { RejeterChangementPuissanceCommand } from './rejeterChangementPuissance.command';

export type RejeterChangementPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.RejeterDemandeChangement',
  {
    identifiantProjetValue: string;
    rejetéLeValue: string;
    rejetéParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
    estUneDécisionDEtatValue: boolean;
  }
>;

export const registerRejeterChangementPuissanceUseCase = () => {
  const runner: MessageHandler<RejeterChangementPuissanceUseCase> = async ({
    identifiantProjetValue,
    rejetéLeValue,
    rejetéParValue,
    réponseSignéeValue: { format, content },
    estUneDécisionDEtatValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const rejetéLe = DateTime.convertirEnValueType(rejetéLeValue);
    const rejetéPar = Email.convertirEnValueType(rejetéParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentPuissance.changementRejeté.formatter(),
      rejetéLe.formatter(),
      format,
    );

    await mediator.send<RejeterChangementPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.RejeterDemandeChangement',
      data: {
        rejetéLe,
        rejetéPar,
        identifiantProjet,
        réponseSignée,
        estUneDécisionDEtat: estUneDécisionDEtatValue,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.Puissance.UseCase.RejeterDemandeChangement', runner);
};
