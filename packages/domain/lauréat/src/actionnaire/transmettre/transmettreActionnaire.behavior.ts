import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { ActionnaireDéjàTransmisError } from '../errors';

export type ActionnaireTransmisEvent = DomainEvent<
  'ActionnaireTransmis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    transmisLe: DateTime.RawType;
    transmisPar: Email.RawType;
  }
>;

export type TransmettreOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateTransmission: DateTime.ValueType;
};

export async function transmettre(
  this: ActionnaireAggregate,
  { identifiantProjet, actionnaire, dateTransmission, identifiantUtilisateur }: TransmettreOptions,
) {
  if (this.actionnaire) {
    throw new ActionnaireDéjàTransmisError();
  }

  const event: ActionnaireTransmisEvent = {
    type: 'ActionnaireTransmis-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      transmisLe: dateTransmission.formatter(),
      transmisPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyActionnaireTransmis(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ActionnaireTransmisEvent,
) {
  this.actionnaire = actionnaire;
}
