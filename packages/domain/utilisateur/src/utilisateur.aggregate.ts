import { match } from 'ts-pattern';

import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';

import {
  AccèsAuProjetAutoriséEvent,
  applyAccèsAuProjetAutorisé,
  inviterPorteur,
} from './inviter/inviterPorteur.behavior';
import { UtilisateurInconnuError } from './utilisateurInconnu.error';
import {
  applyUtilisateurInvité,
  inviter,
  UtilisateurInvitéEvent,
} from './inviter/inviter.behavior';
import { réclamer, ProjetRéclaméEvent, applyProjetRéclamé } from './réclamer/réclamer.behavior';

export type UtilisateurEvent =
  | AccèsAuProjetAutoriséEvent
  | UtilisateurInvitéEvent
  | ProjetRéclaméEvent;
export type UtilisateurAggregate = Aggregate<UtilisateurEvent> & {
  readonly inviterPorteur: typeof inviterPorteur;
  readonly inviter: typeof inviter;
  readonly réclamer: typeof réclamer;
  aAccèsAuProjet: (identifiantProjet: IdentifiantProjet.ValueType) => boolean;
  projets: Set<IdentifiantProjet.RawType>;
  existe: boolean;
};

export const getDefaultUtilisateurAggregate: GetDefaultAggregateState<
  UtilisateurAggregate,
  UtilisateurEvent
> = () => ({
  apply,
  inviterPorteur,
  inviter,
  réclamer,
  projets: new Set(),
  existe: false,
  aAccèsAuProjet(identifiantProjet) {
    return this.projets.has(identifiantProjet.formatter());
  },
});

function apply(this: UtilisateurAggregate, event: UtilisateurEvent) {
  match(event)
    .with({ type: 'AccèsAuProjetAutorisé-V1' }, applyAccèsAuProjetAutorisé.bind(this))
    .with({ type: 'UtilisateurInvité-V1' }, applyUtilisateurInvité.bind(this))
    .with({ type: 'ProjetRéclamé-V1' }, applyProjetRéclamé.bind(this))
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
