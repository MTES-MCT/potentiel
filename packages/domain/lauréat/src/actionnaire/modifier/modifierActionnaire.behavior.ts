import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../actionnaire.aggregate';

export type ActionnaireModifiéEvent = DomainEvent<
  'ActionnaireModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
};

export async function modifier(
  this: ActionnaireAggregate,
  { identifiantProjet, actionnaire, dateModification, identifiantUtilisateur }: ModifierOptions,
) {
  if (this.actionnaire === actionnaire) {
    throw new ActionnaireIdentifiqueError();
  }

  const event: ActionnaireModifiéEvent = {
    type: 'ActionnaireModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyActionnaireModifié(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: ActionnaireModifiéEvent,
) {
  this.actionnaire = actionnaire;
}

class ActionnaireIdentifiqueError extends DomainError {
  constructor() {
    super("L'actionnaire modifié est identique à celui associé au projet");
  }
}
