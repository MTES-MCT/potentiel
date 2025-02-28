import { match } from 'ts-pattern';

import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';

import {
  PorteurInvitéEvent,
  applyPorteurInvité,
  inviterPorteur,
} from './inviter/inviterPorteur.behavior';
import { UtilisateurInconnuError } from './utilisateurInconnu.error';
import {
  applyUtilisateurInvité,
  inviter,
  UtilisateurInvitéEvent,
} from './inviter/inviter.behavior';

export type UtilisateurEvent = PorteurInvitéEvent | UtilisateurInvitéEvent;
export type UtilisateurAggregate = Aggregate<UtilisateurEvent> & {
  readonly inviterPorteur: typeof inviterPorteur;
  readonly inviter: typeof inviter;
  aAccèsAuProjet: (identifiantProjet: IdentifiantProjet.ValueType) => boolean;
  projets: Set<IdentifiantProjet.ValueType>;
  existe: boolean;
};

export const getDefaultUtilisateurAggregate: GetDefaultAggregateState<
  UtilisateurAggregate,
  UtilisateurEvent
> = () => ({
  apply,
  inviterPorteur,
  inviter,
  projets: new Set(),
  existe: false,
  aAccèsAuProjet(identifiantProjet) {
    return this.projets.has(identifiantProjet);
  },
});

function apply(this: UtilisateurAggregate, event: UtilisateurEvent) {
  match(event)
    .with({ type: 'PorteurInvité-V1' }, applyPorteurInvité.bind(this))
    .with({ type: 'UtilisateurInvité-V1' }, applyUtilisateurInvité.bind(this))
    .exhaustive();
}

export const loadUtilisateurFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantUtilisateur: Email.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `utilisateur|${identifiantUtilisateur.formatter()}`,
      getDefaultAggregate: getDefaultUtilisateurAggregate,
      onNone: throwOnNone
        ? () => {
            throw new UtilisateurInconnuError();
          }
        : undefined,
    });
  };
