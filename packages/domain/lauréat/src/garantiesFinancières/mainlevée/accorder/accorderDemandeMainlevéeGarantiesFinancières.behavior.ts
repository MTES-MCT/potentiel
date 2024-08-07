import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { StatutGarantiesFinancières, StatutMainlevéeGarantiesFinancières } from '../..';
import { DemandeMainlevéeNonTrouvéeError } from '../demandeMainlevéeNonTrouvée.error';

export type DemandeMainlevéeGarantiesFinancièresAccordéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function accorderDemandeMainlevéeGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, accordéLe, accordéPar, réponseSignée }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeNonTrouvéeError();
  }

  this.demandeMainlevéeEnCours.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.accordé,
  );

  const event: DemandeMainlevéeGarantiesFinancièresAccordéeEvent = {
    type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: accordéLe.formatter(),
      accordéPar: accordéPar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyDemandeMainlevéeGarantiesFinancièresAccordée(
  this: GarantiesFinancièresAggregate,
  _: DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
) {
  if (this.demandeMainlevéeEnCours) {
    this.demandeMainlevéeEnCours.statut = StatutMainlevéeGarantiesFinancières.accordé;
  } else {
    this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.accordé };
  }
  if (this.actuelles) {
    this.actuelles.statut = StatutGarantiesFinancières.levé;
  }
}
