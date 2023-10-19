import { AggregateFactory, LoadAggregate, Publish } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as StatutAbandon from './statutAbandon.valueType';

import { AbandonDemandéEvent, demander } from './demander/demanderAbandon.behavior';
import {
  ConfirmationAbandonDemandéeEvent,
  demanderConfirmation,
} from './demander/demanderConfirmationAbandon.behavior';
import { AbandonRejetéEvent, rejeter } from './rejeter/rejeterAbandon.behavior';
import { isNone } from '@potentiel/monads';
import { AbandonInconnuErreur } from './abandonInconnu.error';
import { AbandonAccordéEvent, accorder } from './accorder/accorderAbandon.behavior';
import { AbandonAnnuléEvent, annuler } from './annuler/annulerAbandon.behavior';
import { AbandonConfirméEvent, confirmer } from './confirmer/confirmerAbandon.behavior';

type AbandonAggregateId = `abandon|${string}`;

export const createAbandonAggregateId = (
  identifiantProjet: IdentifiantProjet.ValueType,
): AbandonAggregateId => {
  return `abandon|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate; publish: Publish };

export type AbandonAggregate = {
  publish: Publish;
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
  statut: StatutAbandon.convertirEnValueType('demandé'),
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

const abandonAggregateFactory: AggregateFactory<AbandonAggregate, AbandonEvent> = (events) => {
  return events.reduce((aggregate, { type, payload }) => {
    switch (type) {
      case 'AbandonDemandé-V1':
        return createAbandon(aggregate, payload);
      case 'AbandonRejeté-V1':
        return updateAvecRejet(aggregate, payload);
      case 'AbandonAccordé-V1':
        return updateAvecAccord(aggregate, payload);
      case 'ConfirmationAbandonDemandée-V1':
        return updateAvecConfirmationDemandée(aggregate, payload);
      case 'AbandonConfirmé-V1':
        return updateAvecConfirmation(aggregate, payload);
      case 'AbandonAnnulé-V1':
        return updateAvecAnnulation(getDefaultAggregate(), payload);
      default:
        return {
          ...aggregate,
        };
    }
  }, getDefaultAggregate());
};

export const loadAbandonAggregateFactory = ({
  loadAggregate,
  publish,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjet.ValueType, throwIfNone: boolean = true) => {
    const abandon = await loadAggregate<AbandonAggregate, AbandonEvent>(
      createAbandonAggregateId(identifiantProjet),
      abandonAggregateFactory,
    );

    if (isNone(abandon)) {
      if (throwIfNone) {
        throw new AbandonInconnuErreur();
      }
      return abandonAggregateFactory([], loadAggregate);
    }

    abandon.publish = publish; // TODO move that in @potentiel-domain/core and @potentiel-infrastructure/pg-event-sourcing

    return abandon;
  };
};

const createAbandon = (aggregate: AbandonAggregate, payload: AbandonDemandéEvent['payload']) => {
  const { recandidature, pièceJustificative, raison, demandéLe: dateAbandon } = payload;
  const newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('demandé'),
    demande: {
      recandidature,
      pièceJustificative,
      raison,
      demandéLe: DateTime.convertirEnValueType(dateAbandon),
    },
    rejet: undefined,
    accord: undefined,
    annuléLe: undefined,
  };
  return newAggregate;
};

const updateAvecRejet = (aggregate: AbandonAggregate, payload: AbandonRejetéEvent['payload']) => {
  const { rejetéLe, réponseSignée } = payload;
  const newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('rejeté'),
    rejet: {
      rejetéLe: DateTime.convertirEnValueType(rejetéLe),
      réponseSignée,
    },
    accord: undefined,
  };
  return newAggregate;
};

const updateAvecAccord = (aggregate: AbandonAggregate, payload: AbandonAccordéEvent['payload']) => {
  const { acceptéLe, réponseSignée } = payload;
  const newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('accordé'),
    rejet: undefined,
    accord: {
      accordéLe: DateTime.convertirEnValueType(acceptéLe),
      réponseSignée,
    },
  };
  return newAggregate;
};

const updateAvecConfirmationDemandée = (
  aggregate: AbandonAggregate,
  payload: ConfirmationAbandonDemandéeEvent['payload'],
) => {
  const { confirmationDemandéeLe, réponseSignée } = payload;
  let newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('confirmation-demandée'),
  };

  newAggregate.demande.confirmation = {
    demandéLe: DateTime.convertirEnValueType(confirmationDemandéeLe),
    réponseSignée,
  };

  return newAggregate;
};

const updateAvecConfirmation = (
  aggregate: AbandonAggregate,
  payload: AbandonConfirméEvent['payload'],
) => {
  const { confirméLe } = payload;
  let newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('confirmé'),
  };

  if (newAggregate.demande.confirmation) {
    newAggregate.demande.confirmation.confirméLe = DateTime.convertirEnValueType(confirméLe);
  }

  return newAggregate;
};

const updateAvecAnnulation = (
  aggregate: AbandonAggregate,
  payload: AbandonAnnuléEvent['payload'],
) => {
  const { annuléLe } = payload;

  const newAggregate: AbandonAggregate = {
    ...aggregate,
    statut: StatutAbandon.convertirEnValueType('annulé'),
    annuléLe: DateTime.convertirEnValueType(annuléLe),
  };
  return newAggregate;
};
