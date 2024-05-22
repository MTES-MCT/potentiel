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
import {
  AttestationConformitéModifiéeEvent,
  applyAttestationConformitéModifiée,
  modifier,
} from './modifier/modifierAttestationConformité.behavior';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent;

export type AchèvementAggregate = Aggregate<AchèvementEvent> & {
  utilisateur: IdentifiantUtilisateur.ValueType;
  attestationConformité: { format: Option.Type<string>; date: DateTime.ValueType };
  preuveTransmissionAuCocontractant: { format: Option.Type<string>; date: DateTime.ValueType };
  readonly transmettre: typeof transmettre;
  readonly modifier: typeof modifier;
};

export const getDefaultAchèvementAggregate: GetDefaultAggregateState<
  AchèvementAggregate,
  AchèvementEvent
> = () => ({
  utilisateur: IdentifiantUtilisateur.unknownUser,
  attestationConformité: { format: '', date: DateTime.convertirEnValueType(new Date()) },
  preuveTransmissionAuCocontractant: {
    format: '',
    date: DateTime.convertirEnValueType(new Date()),
  },
  apply,
  transmettre,
  modifier,
});

function apply(this: AchèvementAggregate, event: AchèvementEvent) {
  switch (event.type) {
    case 'AttestationConformitéTransmise-V1':
      applyAttestationConformitéTransmise.bind(this)(event);
      break;
    case 'AttestationConformitéModifiée-V1':
      applyAttestationConformitéModifiée.bind(this)(event);
  }
}

export const loadAchèvementFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `achevement|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAchèvementAggregate,
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
