import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import * as StatutChangementReprésentantLégal from '../statutChangementReprésentantLégal.valueType';
import { DemandeChangementInexistanteError } from '../changementReprésentantLégal.error';

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

  const event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent = {
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
  { payload: { rejetéLe } }: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) {
  if (this.demande) {
    this.demande.statut = StatutChangementReprésentantLégal.rejeté;

    this.demande.rejet = {
      rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    };
  }
}
