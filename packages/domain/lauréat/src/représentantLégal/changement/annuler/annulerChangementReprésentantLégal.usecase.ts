import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';
import { SupprimerDocumentProjetSensibleCommand } from '@potentiel-domain/document';

import { loadReprésentantLégalFactory, TypeTâchePlanifiéeChangementReprésentantLégal } from '../..';

import { AnnulerChangementReprésentantLégalCommand } from './annulerChangementReprésentantLégal.command';

export type AnnulerChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerChangementReprésentantLégalUseCase = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const runner: MessageHandler<AnnulerChangementReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateAnnulationValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);

    const représentantLégal = await load(identifiantProjet);

    await mediator.send<AnnulerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateAnnulation,
      },
    });

    if (représentantLégal.demande) {
      await mediator.send<SupprimerDocumentProjetSensibleCommand>({
        type: 'Document.Command.SupprimerDocumentProjetSensible',
        data: {
          documentProjet: représentantLégal.demande.pièceJustificative,
          raison: 'Pièce justificative supprimée automatiquement après annulation',
        },
      });
    }

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
      },
    });
  };

  mediator.register('Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal', runner);
};
