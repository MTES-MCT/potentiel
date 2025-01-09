import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { ActionnaireDéjàTransmisError } from '../errors';

export type ActionnaireTransmisEvent = DomainEvent<
  'ActionnaireTransmis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    transmisLe: DateTime.RawType;
    transmisPar: Email.RawType;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type TransmettreOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateTransmission: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
};

export async function transmettre(
  this: ActionnaireAggregate,
  {
    identifiantProjet,
    actionnaire,
    dateTransmission,
    identifiantUtilisateur,
    pièceJustificative,
  }: TransmettreOptions,
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
      pièceJustificative: pièceJustificative && {
        format: pièceJustificative.format,
      },
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
