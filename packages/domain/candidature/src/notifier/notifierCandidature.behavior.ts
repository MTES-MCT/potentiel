import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureAggregate } from '../candidature.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  validateur: AppelOffre.Validateur;
  attestation: {
    format: string;
  };
};

/**
 * @deprecated Utilisez CandidatureNotifiéeEvent à la place.
 * @deprecated Cet évènement sert à importer les projets de périodes legacy, sans attestation.
 */
export type CandidatureNotifiéeEventV1 = DomainEvent<
  'CandidatureNotifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
  }
>;

export type CandidatureNotifiéeEvent = DomainEvent<
  'CandidatureNotifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
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

  if (!validateur.fonction) {
    throw new FonctionManquanteError();
  }
  if (!validateur.nomComplet) {
    throw new NomManquantError();
  }

  const event: CandidatureNotifiéeEvent = {
    type: 'CandidatureNotifiée-V2',
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
  event: CandidatureNotifiéeEvent | CandidatureNotifiéeEventV1,
) {
  this.estNotifiée = true;
  this.notifiéeLe = DateTime.convertirEnValueType(event.payload.notifiéeLe);
}

class CandidatureDéjàNotifiéeError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`La candidature est déjà notifiée`, { identifiantProjet });
  }
}

class FonctionManquanteError extends InvalidOperationError {
  constructor() {
    super(`La fonction de l'utilisateur doit être précisée pour cette opération`);
  }
}

class NomManquantError extends InvalidOperationError {
  constructor() {
    super(`Le nom de l'utilisateur doit être précisé pour cette opération`);
  }
}
