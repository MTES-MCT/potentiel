import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  effacéLe: DateTime.ValueType;
  effacéPar: IdentifiantUtilisateur.ValueType;
};

export async function effacerHistorique(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, effacéLe, effacéPar }: Options,
) {
  if (!this.actuelles && !this.dépôtsEnCours) {
    getLogger().warn(
      "Il n'y a pas de garanties financières ou de dépôt en cours à effacer pour ce projet",
      { identifiantProjet },
    );
    return;
  }

  const event: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent = {
    type: 'HistoriqueGarantiesFinancièresEffacé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      effacéLe: effacéLe.formatter(),
      effacéPar: effacéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyEffacerHistoriqueGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent,
) {
  this.actuelles = undefined;
  this.dépôtsEnCours = undefined;
}
