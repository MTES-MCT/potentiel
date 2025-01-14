import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { StatutChangementActionnaire } from '../..';
import { ChangementActionnaireInexistanteErreur } from '../../errors';

export type ChangementActionnaireAnnuléEvent = DomainEvent<
  'ChangementActionnaireAnnulé-V1',
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
    throw new ChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.annulé,
  );

  const event: ChangementActionnaireAnnuléEvent = {
    type: 'ChangementActionnaireAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléeLe: dateAnnulation.formatter(),
      annuléePar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireAnnulé(this: ActionnaireAggregate) {
  this.demande = undefined;
}
