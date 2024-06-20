import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DemandeMainlevéeEnCoursNonTrouvéeError } from '../mainlevée.error';
import { StatutMainlevéeGarantiesFinancières } from '../..';

export type DemandeMainlevéeGarantiesFinancièresRejetéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéeLe: DateTime.RawType;
    rejetéePar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéeLe: DateTime.ValueType;
  rejetéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeterDemandeMainlevéeGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeEnCoursNonTrouvéeError();
  }

  this.demandeMainlevéeEnCours.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.rejeté,
  );

  const event: DemandeMainlevéeGarantiesFinancièresRejetéeEvent = {
    type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéeLe: rejetéeLe.formatter(),
      rejetéePar: rejetéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyDemandeMainlevéeGarantiesFinancièresRejetée(
  this: GarantiesFinancièresAggregate,
  { payload: { rejetéeLe } }: DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
) {
  this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.rejeté };
  this.historiqueMainlevéeRejetée = this.historiqueMainlevéeRejetée
    ? [...this.historiqueMainlevéeRejetée, { rejetéeLe: DateTime.convertirEnValueType(rejetéeLe) }]
    : [{ rejetéeLe: DateTime.convertirEnValueType(rejetéeLe) }];
}
