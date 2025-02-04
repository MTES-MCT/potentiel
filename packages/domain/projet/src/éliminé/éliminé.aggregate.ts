import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantProjet } from '..';
import { ProjetAggregateRoot } from '../projet.aggregateRoot';

import {
  ÉliminéNotifiéEvent,
  applyÉliminéNotifié,
  notifier,
} from './notifier/notifierÉliminé.behavior';
import {
  archiver,
  ÉliminéArchivéEvent,
  applyÉliminéArchivé,
} from './archiver/archiverÉliminé.behavior';
import {
  getDefaultRecoursAggregate,
  RecoursAggregate,
  RecoursAggregateId,
  RecoursEvent,
} from './recours/recours.aggregate';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;

export type ÉliminéAggregateId = `éliminé|${IdentifiantProjet.RawType}`;

export type ÉliminéAggregate = Aggregate<ÉliminéEvent> & {
  estArchivé: boolean;
  archiver: typeof archiver;
  notifier: typeof notifier;
  projet: ProjetAggregateRoot;
  recours: RecoursAggregate;
  init: () => Promise<void>;
};

export const getDefaultÉliminéAggregate = (
  projet: ProjetAggregateRoot,
  loadAggregate: LoadAggregate,
): GetDefaultAggregateState<ÉliminéAggregate, ÉliminéEvent> => {
  return () => ({
    estArchivé: false,
    apply,
    notifier,
    archiver,
    projet,
    recours: undefined!,
    init: async function () {
      const recoursAggregateId: RecoursAggregateId = `recours|${projet.identifiant.formatter()}`;
      this.recours = await loadAggregate<RecoursAggregate, RecoursEvent>({
        aggregateId: recoursAggregateId,
        getDefaultAggregate: getDefaultRecoursAggregate(this, loadAggregate),
      });
    },
  });
};

function apply(this: ÉliminéAggregate, event: ÉliminéEvent) {
  switch (event.type) {
    case 'ÉliminéNotifié-V1':
      applyÉliminéNotifié.bind(this)(event);
      break;
    case 'ÉliminéArchivé-V1':
      applyÉliminéArchivé.bind(this)(event);
      break;
  }
}
