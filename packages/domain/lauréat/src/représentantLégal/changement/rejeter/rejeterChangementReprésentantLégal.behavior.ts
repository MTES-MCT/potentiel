import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';

export type ChangementReprésentantLégalRejetéEvent = DomainEvent<
  'ChangementReprésentantLégalRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motifRejet: string;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    rejetAutomatique: boolean;
  }
>;

export type RejeterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateRejet: DateTime.ValueType;
  motifRejet: string;
  rejetAutomatique: boolean;
};

export async function rejeter(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    identifiantUtilisateur,
    motifRejet,
    dateRejet,
    rejetAutomatique,
  }: RejeterOptions,
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
      motifRejet,
      rejetéLe: dateRejet.formatter(),
      rejetéPar: identifiantUtilisateur.formatter(),
      rejetAutomatique,
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
