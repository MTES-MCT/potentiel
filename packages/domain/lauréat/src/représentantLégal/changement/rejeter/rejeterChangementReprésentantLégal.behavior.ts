// Third party

// Workspaces
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';

export type ChangementReprésentantLégalRejetéEvent = DomainEvent<
  'ChangementReprésentantLégalRejeté-V1',
  {
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type RejeterOptions = {
  dateRejet: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function rejeter(
  this: ReprésentantLégalAggregate,
  { dateRejet, identifiantUtilisateur, identifiantProjet }: RejeterOptions,
) {
  if (!this.demande) {
    throw new DemandeChangementInexistanteError();
  }
  this.demande?.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementReprésentantLégal.rejeté,
  );

  const event: ChangementReprésentantLégalRejetéEvent = {
    type: 'ChangementReprésentantLégalRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéLe: dateRejet.formatter(),
      rejetéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalRejeté(
  this: ReprésentantLégalAggregate,
  { payload: { rejetéLe } }: ChangementReprésentantLégalRejetéEvent,
) {
  if (this.demande) {
    this.demande.statut = StatutChangementReprésentantLégal.rejeté;

    this.demande.rejet = {
      rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    };
  }
}

class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucun changement de représentant légal n'est en cours`);
  }
}
