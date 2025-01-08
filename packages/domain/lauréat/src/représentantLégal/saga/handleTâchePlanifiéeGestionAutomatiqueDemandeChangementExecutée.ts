import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
// import { getLogger } from '@potentiel-libraries/monitoring';

import { ReprésentantLégal } from '../..';

export const handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée = async (
  event: TâchePlanifiéeExecutéeEvent,
) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    // getLogger().error(`Appel d'offre non trouvée`, {
    //   identifiantProjet: identifiantProjet.formatter(),
    //   context: 'Lauréat.ReprésentantLégal.Saga.HandleTâchePlanifiéeExécutée',
    // });
    return;
  }

  const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

  if (!période) {
    // getLogger().error(`Période non trouvée`, {
    //   identifiantProjet: identifiantProjet.formatter(),
    //   context: 'Lauréat.ReprésentantLégal.Saga.HandleTâchePlanifiéeExécutée',
    // });
    return;
  }

  const changement =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

  if (Option.isNone(changement)) {
    // getLogger().error(`Aucun changement de représentant légal à traiter`, {
    //   identifiantProjet: identifiantProjet.formatter(),
    //   context: 'Lauréat.ReprésentantLégal.Saga.HandleTâchePlanifiéeExécutée',
    // });
    return;
  }

  const {
    changement: {
      représentantLégal: { typeTâchePlanifiée },
    },
  } = période;

  await match(typeTâchePlanifiée)
    .with('accord-automatique', async () => {
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantUtilisateurValue: Email.system().formatter(),
          dateAccordValue: DateTime.now().formatter(),
          nomReprésentantLégalValue: changement.demande.nomReprésentantLégal,
          typeReprésentantLégalValue: changement.demande.typeReprésentantLégal.formatter(),
          accordAutomatiqueValue: true,
        },
      });
    })
    .with('rejet-automatique', async () => {
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
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
};
