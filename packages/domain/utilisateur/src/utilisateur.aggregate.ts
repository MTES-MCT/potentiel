import { match } from 'ts-pattern';

import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';

import { Role } from '.';

import {
  PorteurInvitéEvent,
  applyPorteurInvité,
  inviterPorteur,
} from './inviter/inviterPorteur.behavior';
import {
  applyUtilisateurInvité,
  inviter,
  UtilisateurInvitéEvent,
} from './inviter/inviterUtilisateur.behavior';
import {
  réclamer,
  ProjetRéclaméEvent,
  applyProjetRéclamé,
} from './réclamer/réclamerProjet.behavior';
import {
  applyAccèsProjetRetiré,
  AccèsProjetRetiréEvent,
} from './retirer/retirerAccèsProjet.behavior';
import { retirerAccèsProjet } from './retirer/retirerAccèsProjet.behavior';
import {
  applyUtilisateurSupprimé,
  UtilisateurSuppriméEvent,
  supprimer,
} from './supprimer/supprimerUtilisateur.behavior';
import { UtilisateurInconnuError } from './errors';

export type UtilisateurEvent =
  | PorteurInvitéEvent
  | UtilisateurInvitéEvent
  | ProjetRéclaméEvent
  | AccèsProjetRetiréEvent
  | UtilisateurSuppriméEvent;
export type UtilisateurAggregate = Aggregate<UtilisateurEvent> & {
  readonly inviterPorteur: typeof inviterPorteur;
  readonly inviter: typeof inviter;
  readonly réclamer: typeof réclamer;
  readonly retirerAccèsProjet: typeof retirerAccèsProjet;
  readonly supprimer: typeof supprimer;
  aAccèsAuProjet: (identifiantProjet: IdentifiantProjet.ValueType) => boolean;
  projets: Set<IdentifiantProjet.RawType>;
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
  réclamer,
  retirerAccèsProjet,
  supprimer,
  projets: new Set(),
  existe: false,
  aAccèsAuProjet(identifiantProjet) {
    return this.projets.has(identifiantProjet.formatter());
  },
});

function apply(this: UtilisateurAggregate, event: UtilisateurEvent) {
  match(event)
    .with({ type: 'PorteurInvité-V1' }, applyPorteurInvité.bind(this))
    .with({ type: 'UtilisateurInvité-V1' }, applyUtilisateurInvité.bind(this))
    .with({ type: 'ProjetRéclamé-V1' }, applyProjetRéclamé.bind(this))
    .with({ type: 'AccèsProjetRetiré-V1' }, applyAccèsProjetRetiré.bind(this))
    .with({ type: 'UtilisateurSupprimé-V1' }, applyUtilisateurSupprimé.bind(this))
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
