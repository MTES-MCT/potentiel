import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ReprésentantLégalAggregate } from '../../représentantLégal.aggregate';
import { StatutDemandeChangementReprésentantLégal, TypeReprésentantLégal } from '../..';

export type ChangementReprésentantLégalDemandéEvent = DomainEvent<
  'ChangementReprésentantLégalDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
  }
>;

export type DemanderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demander(
  this: ReprésentantLégalAggregate,
  {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateDemande,
    identifiantUtilisateur,
  }: DemanderChangementOptions,
) {
  const event: ChangementReprésentantLégalDemandéEvent = {
    type: 'ChangementReprésentantLégalDemandé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal: typeReprésentantLégal.formatter(),
      demandéLe: dateDemande.formatter(),
      demandéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyChangementReprésentantLégalDemandé(
  this: ReprésentantLégalAggregate,
  {
    payload: { nomReprésentantLégal, typeReprésentantLégal },
  }: ChangementReprésentantLégalDemandéEvent,
) {
  this.demande = {
    statut: StatutDemandeChangementReprésentantLégal.demandé,
    nom: nomReprésentantLégal,
    type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
  };
}
