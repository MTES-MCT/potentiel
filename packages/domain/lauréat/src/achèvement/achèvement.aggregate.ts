import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import {
  AttestationConformitéTransmiseEvent,
  applyAttestationConformitéTransmise,
  transmettre,
} from './transmettre/transmettreAttestationConformité.behavior';
import { Option } from '@potentiel-libraries/monads';

export type AchèvementEvent = AttestationConformitéTransmiseEvent;

export type AchèvementAggregate = Aggregate<AchèvementEvent> & {
  dateTransmissionAuCocontractant: DateTime.ValueType;
  date: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  attestation: { format: Option.Type<string> };
  preuveTransmissionAuCocontractant: { format: Option.Type<string> };
  readonly transmettre: typeof transmettre;
};

export const getDefaultAttestationConformitéAggregate: GetDefaultAggregateState<
  AchèvementAggregate,
  AchèvementEvent
> = () => ({
  dateTransmissionAuCocontractant: DateTime.convertirEnValueType(new Date()),
  date: DateTime.convertirEnValueType(new Date()),
  utilisateur: IdentifiantUtilisateur.unknownUser,
  attestation: { format: '' },
  preuveTransmissionAuCocontractant: { format: '' },
  apply,
  transmettre,
});

function apply(this: AchèvementAggregate, event: AchèvementEvent) {
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
      aggregateId: `achevement|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAttestationConformitéAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunAchèvementError();
          }
        : undefined,
    });
  };

class AucunAchèvementError extends AggregateNotFoundError {
  constructor() {
    super(`Il n'y a aucune attestation de conformité pour ce projet`);
  }
}
