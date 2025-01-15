import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutChangementReprésentantLégal } from '../..';

export type ChangementReprésentantLégalAnnuléEvent = DomainEvent<
  'ChangementReprésentantLégalAnnulé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
  }
>;

export type AccorderOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateAnnulation: DateTime.ValueType;
};

export async function annuler(
  this: ReprésentantLégalAggregate,
  { identifiantProjet, identifiantUtilisateur, dateAnnulation }: AccorderOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementInexistanteError();
  }
  this.demande?.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementReprésentantLégal.annulé,
  );

  const event: ChangementReprésentantLégalAnnuléEvent = {
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
  _: ChangementReprésentantLégalAnnuléEvent,
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
