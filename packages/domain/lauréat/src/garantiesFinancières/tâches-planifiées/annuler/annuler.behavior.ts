import { TâchePlanifiéeAggregate } from '@potentiel-domain/tache-planifiee';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

type annulerTâchesOptions = {
  // TODO remove the following options once aggregate root is available
  tâchePlanifiéeEchoir: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel1mois: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel2mois: TâchePlanifiéeAggregate;
};

export async function annulerTâchesPlanifiées(
  this: GarantiesFinancièresAggregate,
  {
    tâchePlanifiéeEchoir,
    tâchePlanifiéeRappel1mois,
    tâchePlanifiéeRappel2mois,
  }: annulerTâchesOptions,
) {
  await tâchePlanifiéeEchoir.annuler();
  await tâchePlanifiéeRappel1mois.annuler();
  await tâchePlanifiéeRappel2mois.annuler();
}
