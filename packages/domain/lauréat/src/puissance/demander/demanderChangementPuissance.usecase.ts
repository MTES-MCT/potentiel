import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { TypeDocumentPuissance } from '..';

import { DemanderChangementCommand } from './demanderChangementPuissance.command';

export type DemanderChangementUseCase = Message<
  'Lauréat.Puissance.UseCase.DemanderChangement',
  {
    puissanceValue: number;
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    raisonValue: string;
  }
>;

export const registerDemanderChangementPuissanceUseCase = () => {
  const runner: MessageHandler<DemanderChangementUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
    puissanceValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentPuissance.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue!.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<DemanderChangementCommand>({
      type: 'Lauréat.Puissance.Command.DemanderChangement',
      data: {
        dateDemande,
        raison: raisonValue,
        puissance: puissanceValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Puissance.UseCase.DemanderChangement', runner);
};
