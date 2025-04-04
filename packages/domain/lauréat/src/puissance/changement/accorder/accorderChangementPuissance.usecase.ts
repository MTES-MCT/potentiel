import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { TypeDocumentPuissance } from '../..';

import { AccorderChangementPuissanceCommand } from './accorderChangementPuissance.command';

export type AccorderChangementPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.AccorderDemandeChangement',
  {
    identifiantProjetValue: string;
    accordéLeValue: string;
    accordéParValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
    rôleUtilisateurValue: string;
  }
>;

export const registerAccorderChangementPuissanceUseCase = () => {
  const runner: MessageHandler<AccorderChangementPuissanceUseCase> = async ({
    identifiantProjetValue,
    accordéLeValue,
    accordéParValue,
    réponseSignéeValue: { format, content },
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const accordéLe = DateTime.convertirEnValueType(accordéLeValue);
    const accordéPar = Email.convertirEnValueType(accordéParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentPuissance.changementAccordé.formatter(),
      accordéLe.formatter(),
      format,
    );
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<AccorderChangementPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.AccorderChangement',
      data: {
        accordéLe,
        accordéPar,
        identifiantProjet,
        réponseSignée,
        rôleUtilisateur,
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
  mediator.register('Lauréat.Puissance.UseCase.AccorderDemandeChangement', runner);
};
