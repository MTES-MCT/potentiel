import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentActionnaire } from '../..';
import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet';

import { DemanderChangementCommand } from './demanderChangementActionnaire.command';

export type DemanderChangementUseCase = Message<
  'Lauréat.Actionnaire.UseCase.DemanderChangement',
  {
    actionnaireValue: string;
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

export const registerDemanderChangementActionnaireUseCase = () => {
  const runner: MessageHandler<DemanderChangementUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
    actionnaireValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentActionnaire.pièceJustificative.formatter(),
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
      type: 'Lauréat.Actionnaire.Command.DemanderChangement',
      data: {
        dateDemande,
        raison: raisonValue,
        actionnaire: actionnaireValue,
        identifiantProjet,
        identifiantUtilisateur,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.DemanderChangement', runner);
};
