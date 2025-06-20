import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { TâchePlanifiéeAggregate } from '@potentiel-domain/tache-planifiee';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type?: Candidature.TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  importéLe: DateTime.ValueType;

  // TODO remove the following options once aggregate root is available
  estAchevé: boolean;
  tâchePlanifiéeEchoir: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel1mois: TâchePlanifiéeAggregate;
  tâchePlanifiéeRappel2mois: TâchePlanifiéeAggregate;
};

export async function importerType(
  this: GarantiesFinancièresAggregate,
  {
    identifiantProjet,
    type,
    dateÉchéance,
    importéLe,
    estAchevé,
    tâchePlanifiéeEchoir,
    tâchePlanifiéeRappel1mois,
    tâchePlanifiéeRappel2mois,
  }: Options,
) {
  if (!type) {
    return;
  }

  const event: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent = {
    type: 'TypeGarantiesFinancièresImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      importéLe: importéLe.formatter(),
    },
  };

  await this.ajouterTâchesPlanifiées({
    dateÉchéance,
    tâchePlanifiéeEchoir,
    tâchePlanifiéeRappel1mois,
    tâchePlanifiéeRappel2mois,
    estAchevé,
  });

  await this.publish(event);
}

export function applyTypeGarantiesFinancièresImporté(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, importéLe },
  }: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent,
) {
  this.actuelles = {
    ...this.actuelles,
    statut: StatutGarantiesFinancières.validé,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    importéLe: DateTime.convertirEnValueType(importéLe),
  };
}
