import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { StatutMainlevéeGarantiesFinancières } from '../..';
import { DocumentProjet } from '@potentiel-domain/document';
import { DemandeMainlevéeEnCoursNonTrouvéeError } from '../mainlevée.error';

export type DemandeMainlevéeGarantiesFinancièresAccordéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéeLe: DateTime.RawType;
    accordéePar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéeLe: DateTime.ValueType;
  accordéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function accorderDemandeMainlevéeGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, accordéeLe, accordéePar, réponseSignée }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeEnCoursNonTrouvéeError();
  }

  this.demandeMainlevéeEnCours.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.accordé,
  );

  const event: DemandeMainlevéeGarantiesFinancièresAccordéeEvent = {
    type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéeLe: accordéeLe.formatter(),
      accordéePar: accordéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyDemandeMainlevéeGarantiesFinancièresAccordée(
  this: GarantiesFinancièresAggregate,
) {
  this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.accordé };
}
