import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, NotFoundError } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type HistoriqueGarantiesFinancièresEffacéEvent = DomainEvent<
  'HistoriqueGarantiesFinancièresEffacé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    effacéLe: DateTime.RawType;
    effacéPar: IdentifiantUtilisateur.RawType;
  }
>;

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
    throw new AucunHistoriqueÀEffacerError();
  }

  const event: HistoriqueGarantiesFinancièresEffacéEvent = {
    type: 'HistoriqueGarantiesFinancièresEffacé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      effacéLe: effacéLe.formatter(),
      effacéPar: effacéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyEffacerHistoriqueGarantiesFinancières(this: GarantiesFinancièresAggregate) {
  this.actuelles = undefined;
  this.dépôtsEnCours = undefined;
}

class AucunHistoriqueÀEffacerError extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières sur ce projet`);
  }
}
