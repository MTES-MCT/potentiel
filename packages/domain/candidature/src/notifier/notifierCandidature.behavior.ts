import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  validateur: {
    fonction: string;
    nomComplet: string;
  };
  attestation: {
    format: string;
  };
};

export type CandidatureNotifiéeEvent = DomainEvent<
  'CandidatureNotifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: {
      fonction: string;
      nomComplet: string;
    };
    attestation: {
      format: string;
    };
  }
>;

export async function notifier(
  this: CandidatureAggregate,
  {
    identifiantProjet,
    notifiéeLe,
    notifiéePar,
    validateur,
    attestation: { format },
  }: NotifierOptions,
) {
  if (this.estNotifiée) {
    throw new CandidatureDéjàNotifiéeError(identifiantProjet);
  }

  const event: CandidatureNotifiéeEvent = {
    type: 'CandidatureNotifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      notifiéeLe: notifiéeLe.formatter(),
      notifiéePar: notifiéePar.formatter(),
      validateur,
      attestation: {
        format,
      },
    },
  };

  await this.publish(event);
}

export function applyCandidatureNotifiée(
  this: CandidatureAggregate,
  _event: CandidatureNotifiéeEvent,
) {
  this.estNotifiée = true;
}

class CandidatureDéjàNotifiéeError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`La candidature est déjà notifiée`, { identifiantProjet });
  }
}
