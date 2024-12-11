import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { TypeDocumentActionnaire } from '..';

import { DemanderModificationCommand } from './demandeModification.command';

export type DemanderModificationUseCase = Message<
  'Lauréat.Actionnaire.UseCase.DemanderModification',
  {
    actionnaireValue: string;
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    raisonValue?: string;
  }
>;

// TODO: après POC Julien et Hub, gestion multidocument
export const registerDemanderModificationActionnaireUseCase = () => {
  const runner: MessageHandler<DemanderModificationUseCase> = async ({
    dateDemandeValue,
    identifiantProjetValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    raisonValue,
    actionnaireValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

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

    await mediator.send<DemanderModificationCommand>({
      type: 'Lauréat.Actionnaire.Command.DemanderModification',
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
  mediator.register('Lauréat.Actionnaire.UseCase.DemanderModification', runner);
};
