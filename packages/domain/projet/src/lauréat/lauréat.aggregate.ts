import { DateTime } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState } from '@potentiel-domain/core';

import { IdentifiantProjet } from '..';
import { ProjetAggregateRoot } from '../projet.aggregateRoot';

import {
  LauréatNotifiéEvent,
  applyLauréatNotifié,
  notifier,
} from './notifier/notifierLauréat.behavior';

export type LauréatEvent = LauréatNotifiéEvent;

export type LauréatAggregateId = `lauréat|${IdentifiantProjet.RawType}`;

export interface LauréatAggregate extends Aggregate<LauréatEvent> {
  notifiéLe: DateTime.ValueType;
  notifier: typeof notifier;
  projet: ProjetAggregateRoot;
  init: () => Promise<void>;
}

export const getDefaultLauréatAggregate = (
  projet: ProjetAggregateRoot,
): GetDefaultAggregateState<LauréatAggregate, LauréatEvent> => {
  return () => ({
    identifiantProjet: IdentifiantProjet.inconnu,
    notifiéLe: DateTime.now(),
    apply,
    notifier,
    projet,
    init: async () => {
      return Promise.resolve();
    },
  });
};

function apply(this: LauréatAggregate, event: LauréatEvent) {
  switch (event.type) {
    case 'LauréatNotifié-V1':
      applyLauréatNotifié.bind(this)(event);
      break;
  }
}
