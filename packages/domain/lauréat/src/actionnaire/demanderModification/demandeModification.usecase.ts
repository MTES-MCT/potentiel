import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { TypeDocumentActionnaire } from '..';

import { DemanderModificationCommand } from './demandeModification.command';

// TODO :
// Pour tout type de demande, il faut vérifier que le CDC permet une demande via Potentiel
// nous avons besoin du CDC actuel et de l'AO pour vérifier cela

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

export const registerDemanderModificationUseCase = () => {
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
      // voir si besoin
      TypeDocumentActionnaire.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

    // voir comment gérer le multi document ici
    // zip
    // contraindre le porteur sinon
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
