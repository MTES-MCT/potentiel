import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { StatutChangementActionnaire } from '..';
import { DemandeDeChangementInexistanteError } from '../errors';

export type DemandeChangementActionnaireAnnuléEvent = DomainEvent<
  'DemandeChangementActionnaireAnnulée-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
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
  if (!this.statutDemande) {
    throw new DemandeDeChangementInexistanteError();
  }

  this.statutDemande.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.annulé,
  );

  const event: DemandeChangementActionnaireAnnuléEvent = {
    type: 'DemandeChangementActionnaireAnnulée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDemandeChangementActionnaireAnnulée(this: ActionnaireAggregate) {
  this.statutDemande = StatutChangementActionnaire.annulé;
}
