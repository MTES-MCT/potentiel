import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { DemanderModificationActionnaireCommand } from './demandeModification.command';

// TODO :
// Pour tout type de demande, il faut vérifier que le CDC permet une demande via Potentiel
// nous avons besoin du CDC actuel et de l'AO pour vérifier cela

export type DemanderModificationActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.DemanderModification',
  {
    dateDemandeValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    raisonValue?: string;
    actionnaireValue: boolean;
  }
>;

export const registerDemanderModificationActionnaireUseCase = () => {
  const runner: MessageHandler<DemanderModificationActionnaireUseCase> = async ({
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

    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          // voir si besoin
          TypeDocumentAbandon.pièceJustificative.formatter(),
          dateDemandeValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    // voir comment gérer le multi document ici
    // zip
    // contraindre le porteur sinon
    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }

    await mediator.send<DemanderModificationActionnaireCommand>({
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
