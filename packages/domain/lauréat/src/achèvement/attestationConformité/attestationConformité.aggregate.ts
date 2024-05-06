import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import {
  AttestationConformitéTransmiseEvent,
  applyAttestationConformitéTransmise,
  transmettre,
} from './transmettre/transmettreAttestationConformité.behavior';
import { AucuneAttestationConformitéError } from './aucuneAttestationConformité.error';

export type AttestationConformitéEvent = AttestationConformitéTransmiseEvent;

export type AttestationConformitéAggregate = Aggregate<AttestationConformitéEvent> & {
  dateTransmissionAuCocontractant: DateTime.ValueType;
  date: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  readonly transmettre: typeof transmettre;
};

export const getDefaultAttestationConformitéAggregate: GetDefaultAggregateState<
  AttestationConformitéAggregate,
  AttestationConformitéEvent
> = () => ({
  dateTransmissionAuCocontractant: DateTime.convertirEnValueType(new Date()),
  date: DateTime.convertirEnValueType(new Date()),
  utilisateur: IdentifiantUtilisateur.convertirEnValueType('unknown-user@unknown-email.com'),
  apply,
  transmettre,
});

function apply(this: AttestationConformitéAggregate, event: AttestationConformitéEvent) {
  switch (event.type) {
    case 'AttestationConformitéTransmise-V1':
      applyAttestationConformitéTransmise.bind(this)(event);
      break;
  }
}

export const loadAttestationConformitéFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `attestation-conformite|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAttestationConformitéAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucuneAttestationConformitéError();
          }
        : undefined,
    });
  };
