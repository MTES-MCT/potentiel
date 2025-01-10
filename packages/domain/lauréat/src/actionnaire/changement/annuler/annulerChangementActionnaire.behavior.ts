import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { StatutChangementActionnaire } from '../..';
import { DemandeChangementActionnaireInexistanteErreur } from '../../errors';

export type DemandeChangementActionnaireAnnuléeEvent = DomainEvent<
  'DemandeChangementActionnaireAnnulée-V1',
  {
    annuléeLe: DateTime.RawType;
    annuléePar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type AnnulerOptions = {
  dateAnnulation: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function annulerDemandeChangement(
  this: ActionnaireAggregate,
  { dateAnnulation, identifiantUtilisateur, identifiantProjet }: AnnulerOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.annulé,
  );

  const event: DemandeChangementActionnaireAnnuléeEvent = {
    type: 'DemandeChangementActionnaireAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléeLe: dateAnnulation.formatter(),
      annuléePar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDemandeChangementActionnaireAnnulée(this: ActionnaireAggregate) {
  this.demande = undefined;
}
