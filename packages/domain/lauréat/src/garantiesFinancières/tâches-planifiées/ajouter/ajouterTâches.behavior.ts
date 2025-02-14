import { DateTime } from '@potentiel-domain/common';
import { TâchePlanifiéeAggregate } from '@potentiel-domain/tache-planifiee';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

type AjouterTâchesOptions = {
  dateÉchéance?: DateTime.ValueType;

  // TODO remove the following options once aggregate root is available
  estAchevé?: boolean;
  tâchePlanifiéeEchoir: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel1mois: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel2mois: TâchePlanifiéeAggregate;
};

export async function ajouterTâches(
  this: GarantiesFinancièresAggregate,
  {
    estAchevé,
    dateÉchéance,
    tâchePlanifiéeEchoir,
    tâchePlanifiéeRappel1mois,
    tâchePlanifiéeRappel2mois,
  }: AjouterTâchesOptions,
) {
  if (dateÉchéance && !estAchevé) {
    await tâchePlanifiéeEchoir.ajouter({
      àExécuterLe: dateÉchéance.ajouterNombreDeJours(1),
    });

    await tâchePlanifiéeRappel1mois.ajouter({
      àExécuterLe: dateÉchéance.retirerNombreDeMois(1),
    });

    await tâchePlanifiéeRappel2mois.ajouter({
      àExécuterLe: dateÉchéance.retirerNombreDeMois(2),
    });
  }
}
