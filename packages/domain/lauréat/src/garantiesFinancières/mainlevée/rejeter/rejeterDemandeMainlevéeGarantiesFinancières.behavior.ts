import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Lauréat } from '@potentiel-domain/projet';

import { StatutMainlevéeGarantiesFinancières } from '../..';
import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DemandeMainlevéeNonTrouvéeError } from '../demandeMainlevéeNonTrouvée.error';

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeterDemandeMainlevéeGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, rejetéLe, rejetéPar, réponseSignée }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeNonTrouvéeError();
  }

  this.demandeMainlevéeEnCours.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.rejeté,
  );

  const event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent = {
    type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéLe: rejetéLe.formatter(),
      rejetéPar: rejetéPar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyDemandeMainlevéeGarantiesFinancièresRejetée(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
) {
  if (this.demandeMainlevéeEnCours) {
    this.demandeMainlevéeEnCours.statut = StatutMainlevéeGarantiesFinancières.rejeté;
  } else {
    this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.rejeté };
  }
}
