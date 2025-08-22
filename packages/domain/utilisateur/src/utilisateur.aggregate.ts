import { match } from 'ts-pattern';

import type { Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import type { Role } from '.';
import {
  applyUtilisateurDésactivé,
  désactiver,
  type UtilisateurDésactivéEvent,
} from './désactiver/désactiverUtilisateur.behavior';
import { UtilisateurInconnuError } from './errors';
import {
  applyPorteurInvité,
  inviterPorteur,
  type PorteurInvitéEvent,
} from './inviter/inviterPorteur.behavior';
import {
  applyUtilisateurInvité,
  inviter,
  type UtilisateurInvitéEvent,
} from './inviter/inviterUtilisateur.behavior';
import {
  applyUtilisateurRéactivé,
  réactiver,
  type UtilisateurRéactivéEvent,
} from './réactiver/réactiverUtilisateur.behavior';
import type { AccèsProjetRetiréEvent, ProjetRéclaméEvent } from './utilisateur.event';

export type UtilisateurEvent =
  | PorteurInvitéEvent
  | UtilisateurInvitéEvent
  | UtilisateurDésactivéEvent
  | UtilisateurRéactivéEvent
  | AccèsProjetRetiréEvent
  | ProjetRéclaméEvent;

export type UtilisateurAggregate = Aggregate<UtilisateurEvent> & {
  readonly inviterPorteur: typeof inviterPorteur;
  readonly inviter: typeof inviter;
  readonly désactiver: typeof désactiver;
  readonly réactiver: typeof réactiver;
  aAccèsAuProjet: (identifiantProjet: IdentifiantProjet.ValueType) => boolean;
  projets: Set<IdentifiantProjet.RawType>;
  actif: boolean;
} & (
    | {
        existe: false;
        rôle?: undefined;
      }
    | {
        existe: true;
        rôle: Role.ValueType;
      }
  );

export const getDefaultUtilisateurAggregate: GetDefaultAggregateState<
  UtilisateurAggregate,
  UtilisateurEvent
> = () => ({
  apply,
  inviterPorteur,
  inviter,
  désactiver,
  réactiver,
  projets: new Set(),
  existe: false,
  actif: false,
  aAccèsAuProjet(identifiantProjet) {
    return this.projets.has(identifiantProjet.formatter());
  },
});

function apply(this: UtilisateurAggregate, event: UtilisateurEvent) {
  match(event)
    .with({ type: 'PorteurInvité-V1' }, applyPorteurInvité.bind(this))
    .with({ type: 'UtilisateurInvité-V1' }, applyUtilisateurInvité.bind(this))
    .with({ type: 'UtilisateurDésactivé-V1' }, applyUtilisateurDésactivé.bind(this))
    .with({ type: 'UtilisateurRéactivé-V1' }, applyUtilisateurRéactivé.bind(this))
    .with({ type: 'AccèsProjetRetiré-V1' }, () => {})
    .with({ type: 'ProjetRéclamé-V1' }, () => {})
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
