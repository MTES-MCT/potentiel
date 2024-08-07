import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DemandeMainlevéeNonTrouvéeError } from '../demandeMainlevéeNonTrouvée.error';
import { StatutMainlevéeGarantiesFinancières } from '../..';

export type DemandeMainlevéeGarantiesFinancièresRejetéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

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

  const event: DemandeMainlevéeGarantiesFinancièresRejetéeEvent = {
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
  _: DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
) {
  if (this.demandeMainlevéeEnCours) {
    this.demandeMainlevéeEnCours.statut = StatutMainlevéeGarantiesFinancières.rejeté;
  } else {
    this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.rejeté };
  }
}
