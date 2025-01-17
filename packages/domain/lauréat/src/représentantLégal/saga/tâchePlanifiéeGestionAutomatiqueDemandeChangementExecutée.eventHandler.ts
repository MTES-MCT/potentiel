import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { LoadAggregate } from '@potentiel-domain/core';

import { ReprésentantLégal } from '../..';
import { loadReprésentantLégalFactory, TypeTâchePlanifiéeChangementReprésentantLégal } from '..';

export const buildTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeEventHandler = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const handler = async (event: TâchePlanifiéeExecutéeEvent) => {
    if (
      TypeTâchePlanifiéeChangementReprésentantLégal.convertirEnValueType(
        event.payload.typeTâchePlanifiée,
      ).estGestionAutomatiqueDemandeChangement()
    ) {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        event.payload.identifiantProjet,
      );

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantProjet.appelOffre,
        },
      });

      if (Option.isNone(appelOffre)) {
        throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
          `Appel d'offre non trouvé`,
          identifiantProjet.formatter(),
        );
      }

      const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

      if (!période) {
        throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
          `Période non trouvée`,
          identifiantProjet.formatter(),
        );
      }

      const représentantLégal = await load(identifiantProjet);

      if (!représentantLégal.demande) {
        throw new TâchePlanifiéeGestionAutomatiqueDemandeChangementError(
          `Aucun changement de représentant légal à traiter`,
          identifiantProjet.formatter(),
        );
      }

      const {
        demande: { nom: nomReprésentantLégalValue, type: typeReprésentantLégal },
      } = représentantLégal;

      const {
        changement: {
          représentantLégal: { typeTâchePlanifiée },
        },
      } = période;

      await match(typeTâchePlanifiée)
        .with('accord-automatique', async () => {
          await mediator.send<ReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
            type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              identifiantUtilisateurValue: Email.system().formatter(),
              dateAccordValue: DateTime.now().formatter(),
              nomReprésentantLégalValue,
              typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
              accordAutomatiqueValue: true,
            },
          });
        })
        .with('rejet-automatique', async () => {
          await mediator.send<ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
            type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              identifiantUtilisateurValue: Email.system().formatter(),
              motifRejetValue: 'Rejet automatique',
              dateRejetValue: DateTime.now().formatter(),
              rejetAutomatiqueValue: true,
            },
          });
        })
        .exhaustive();
    }
  };

  return handler;
};

class TâchePlanifiéeGestionAutomatiqueDemandeChangementError extends Error {
  constructor(
    public cause: string,
    public identifiantProjet: string,
  ) {
    super(
      `Impossible de traiter automatiquement la tâche planifier pour le changement de représentant légal`,
    );
  }
}
