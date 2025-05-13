import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  applyAttestationConformitéTransmise,
  transmettre,
} from './transmettre/transmettreAttestationConformité.behavior';
import {
  AttestationConformitéModifiéeEvent,
  applyAttestationConformitéModifiée,
  modifier,
} from './modifier/modifierAttestationConformité.behavior';

export type AchèvementEvent =
  | Lauréat.Achèvement.AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent;

export type AchèvementAggregate = Aggregate<AchèvementEvent> & {
  utilisateur: IdentifiantUtilisateur.ValueType;
  attestationConformité?: { format: string; date: DateTime.ValueType };
  preuveTransmissionAuCocontractant?: { format: Option.Type<string>; date: DateTime.ValueType };
  readonly transmettre: typeof transmettre;
  readonly modifier: typeof modifier;
  readonly estAchevé: () => boolean;
};

export const getDefaultAchèvementAggregate: GetDefaultAggregateState<
  AchèvementAggregate,
  AchèvementEvent
> = () => ({
  utilisateur: IdentifiantUtilisateur.unknownUser,
  apply,
  transmettre,
  modifier,
  estAchevé() {
    return !!(this.attestationConformité && this.preuveTransmissionAuCocontractant);
  },
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
