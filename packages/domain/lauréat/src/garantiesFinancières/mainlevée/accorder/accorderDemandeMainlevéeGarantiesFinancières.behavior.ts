import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { StatutMainlevéeGarantiesFinancières } from '../..';
import { DemandeMainlevéeNonTrouvéeError } from '../demandeMainlevéeNonTrouvée.error';

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

  const event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent = {
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
  _: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
) {
  if (this.demandeMainlevéeEnCours) {
    this.demandeMainlevéeEnCours.statut = StatutMainlevéeGarantiesFinancières.accordé;
  } else {
    this.demandeMainlevéeEnCours = { statut: StatutMainlevéeGarantiesFinancières.accordé };
  }
  if (this.actuelles) {
    this.actuelles.statut = Lauréat.GarantiesFinancières.StatutGarantiesFinancières.levé;
  }
}
