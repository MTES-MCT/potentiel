import { InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutChangementReprésentantLégal } from '../..';

export type AnnulerOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateAnnulation: DateTime.ValueType;
};

export async function annuler(
  this: ReprésentantLégalAggregate,
  { identifiantProjet, identifiantUtilisateur, dateAnnulation }: AnnulerOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementInexistanteError();
  }
  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementReprésentantLégal.annulé,
  );

  const event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent = {
    type: 'ChangementReprésentantLégalAnnulé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      annuléLe: dateAnnulation.formatter(),
      annuléPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalAnnulé(
  this: ReprésentantLégalAggregate,
  _: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) {
  if (this.demande) {
    this.demande = undefined;
  }
}

class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement de représentant légal n'est en cours`);
  }
}
