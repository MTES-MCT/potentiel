import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import {
  AttestationConformitéTransmiseEvent,
  applyAttestationConformitéTransmise,
  transmettre,
} from './transmettre/transmettreAttestationConformité.behavior';
import { AucuneAttestationConformitéError } from './aucuneAttestationConformité.error';
import { Option } from '@potentiel-libraries/monads';

export type AttestationConformitéEvent = AttestationConformitéTransmiseEvent;

export type AttestationConformitéAggregate = Aggregate<AttestationConformitéEvent> & {
  dateTransmissionAuCocontractant: DateTime.ValueType;
  date: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  attestation: { format: Option.Type<string> };
  preuveTransmissionAuCocontractant: { format: Option.Type<string> };
  readonly transmettre: typeof transmettre;
};

export const getDefaultAttestationConformitéAggregate: GetDefaultAggregateState<
  AttestationConformitéAggregate,
  AttestationConformitéEvent
> = () => ({
  dateTransmissionAuCocontractant: DateTime.convertirEnValueType(new Date()),
  date: DateTime.convertirEnValueType(new Date()),
  utilisateur: IdentifiantUtilisateur.convertirEnValueType('unknown-user@unknown-email.com'),
  attestation: { format: '' },
  preuveTransmissionAuCocontractant: { format: '' },
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
