import { AggregateFactory } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet, LoadAggregateDependencies } from '@potentiel-domain/common';

import * as StatutAbandon from './statutAbandon.valueType';

import {
  AbandonDemandéEvent,
  applyAbandonDemandé,
  demander,
} from './demander/demanderAbandon.behavior';
import {
  ConfirmationAbandonDemandéeEvent,
  applyConfirmationAbandonDemandée,
  demanderConfirmation,
} from './demander/demanderConfirmationAbandon.behavior';
import { AbandonRejetéEvent, applyAbandonRejeté, rejeter } from './rejeter/rejeterAbandon.behavior';
import { isNone } from '@potentiel/monads';
import { AbandonInconnuErreur } from './abandonInconnu.error';
import {
  AbandonAccordéEvent,
  accorder,
  applyAbandonAccordé,
} from './accorder/accorderAbandon.behavior';
import { AbandonAnnuléEvent, annuler, applyAbandonAnnulé } from './annuler/annulerAbandon.behavior';
import {
  AbandonConfirméEvent,
  applyAbandonConfirmé,
  confirmer,
} from './confirmer/confirmerAbandon.behavior';

export type AbandonAggregate = {
  publish: (event: AbandonEvent) => Promise<void>; // TODO move that in @potentiel-domain/core
  apply: (event: AbandonEvent) => void; // TODO move that in @potentiel-domain/core
  statut: StatutAbandon.ValueType;
  demande: {
    raison: string;
    pièceJustificative?: {
      format: string;
    };
    recandidature: boolean;
    demandéLe: DateTime.ValueType;
    confirmation?: {
      réponseSignée: {
        format: string;
      };
      demandéLe: DateTime.ValueType;
      confirméLe?: DateTime.ValueType;
    };
  };
  rejet?: {
    rejetéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  accord?: {
    accordéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  annuléLe?: DateTime.ValueType;
  readonly accorder: typeof accorder;
  readonly annuler: typeof annuler;
  readonly confirmer: typeof confirmer;
  readonly demander: typeof demander;
  readonly demanderConfirmation: typeof demanderConfirmation;
  readonly rejeter: typeof rejeter;
};

export type AbandonEvent =
  | AbandonDemandéEvent
  | AbandonAnnuléEvent
  | AbandonRejetéEvent
  | AbandonAccordéEvent
  | ConfirmationAbandonDemandéeEvent
  | AbandonConfirméEvent;

const getDefaultAggregate = (): AbandonAggregate => ({
  publish: () => Promise.resolve(),
  apply,
  statut: StatutAbandon.convertirEnValueType('inconnu'),
  demande: {
    raison: '',
    pièceJustificative: {
      format: '',
    },
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
  },
  accorder,
  annuler,
  confirmer,
  demander,
  demanderConfirmation,
  rejeter,
});

function apply(this: AbandonAggregate, event: AbandonEvent) {
  switch (event.type) {
    case 'AbandonAccordé-V1':
      applyAbandonAccordé.bind(this)(event);
      break;
    case 'AbandonAnnulé-V1':
      applyAbandonAnnulé.bind(this)(event);
      break;
    case 'AbandonConfirmé-V1':
      applyAbandonConfirmé.bind(this)(event);
      break;
    case 'AbandonDemandé-V1':
      applyAbandonDemandé.bind(this)(event);
      break;
    case 'AbandonRejeté-V1':
      applyAbandonRejeté.bind(this)(event);
      break;
    case 'ConfirmationAbandonDemandée-V1':
      applyConfirmationAbandonDemandée.bind(this)(event);
      break;
  }
}

const abandonAggregateFactory: AggregateFactory<AbandonAggregate, AbandonEvent> = (events) => {
  const aggregate = getDefaultAggregate();
  for (const event of events) {
    aggregate.apply(event);
  }
  return aggregate;
};

export const loadAbandonAggregateFactory = ({
  loadAggregate,
  publish,
}: LoadAggregateDependencies) => {
  return async (identifiantProjet: IdentifiantProjet.ValueType, throwIfNone: boolean = true) => {
    const abandon = await loadAggregate<AbandonAggregate, AbandonEvent>(
      `abandon|${identifiantProjet.formatter()}`,
      abandonAggregateFactory,
    );

    if (isNone(abandon)) {
      if (throwIfNone) {
        throw new AbandonInconnuErreur();
      }
      return abandonAggregateFactory([], loadAggregate);
    }

    // TODO move that in @potentiel-domain/core and @potentiel-infrastructure/pg-event-sourcing
    abandon.publish = async (event) => {
      console.log('publish');
      console.log(event);
      await publish(abandon.aggregateId, event);
      abandon.apply(event);
    };

    return abandon;
  };
};
