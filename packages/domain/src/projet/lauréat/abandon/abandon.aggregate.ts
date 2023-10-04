import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjetValueType } from '../../projet.valueType';
import {
  AbandonDemandéEvent,
  AbandonEvent,
  AbandonAccordéEvent,
  AbandonRejetéEvent,
  ConfirmationAbandonDemandéEvent,
  AbandonConfirméEvent,
} from './abandon.event';
import { StatutAbandon } from './abandon.valueType';
import { DateTime, convertirEnDateTime } from '../../../common.valueType';

type AbandonAggregateId = `abandon|${string}`;

export const createAbandonAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): AbandonAggregateId => {
  return `abandon|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Abandon = {
  getStatut: () => StatutAbandon;
  demande: {
    raison: string;
    piéceJustificative?: {
      format: string;
    };
    recandidature: boolean;
    demandéLe: DateTime;
    confirmation?: {
      réponseSignée: {
        format: string;
      };
      demandéLe: DateTime;
      confirméLe?: DateTime;
    };
  };
  rejet?: {
    rejetéLe: DateTime;
    réponseSignée: {
      format: string;
    };
  };
  accord?: {
    accordéLe: DateTime;
    réponseSignée: {
      format: string;
    };
  };
  annuléLe?: DateTime;
};

const getDefaultAggregate = (): Abandon => ({
  getStatut: function () {
    if (this.annuléLe) {
      return 'annulé';
    }
    if (this.rejet) {
      return 'rejeté';
    }

    if (this.accord) {
      return 'accordé';
    }

    if (this.demande.confirmation && !this.demande.confirmation.confirméLe) {
      return 'confirmation-demandé';
    }

    if (this.demande.confirmation && this.demande.confirmation.confirméLe) {
      return 'confirmé';
    }

    return 'demandé';
  },
  demande: {
    raison: '',
    piéceJustificative: {
      format: '',
    },
    recandidature: false,
    demandéLe: {
      date: new Date(),
    },
  },
});

const abandonAggregateFactory: AggregateFactory<Abandon, AbandonEvent> = (events) => {
  return events.reduce((aggregate, { type, payload }) => {
    switch (type) {
      case 'AbandonDemandé-V1':
        return createAbandon(aggregate, payload);
      case 'AbandonRejeté-V1':
        return updateAvecRejet(aggregate, payload);
      case 'AbandonAccordé-V1':
        return updateAvecAcceptation(aggregate, payload);
      case 'ConfirmationAbandonDemandé-V1':
        return updateAvecConfirmationAbandonDemandé(aggregate, payload);
      case 'AbandonConfirmé-V1':
        return updateAvecAbandonConfirmé(aggregate, payload);
      case 'AbandonAnnulé-V1':
        const { annuléLe } = payload;
        return {
          annuléLe: convertirEnDateTime(annuléLe),
          ...getDefaultAggregate(),
        };
      default:
        return {
          ...aggregate,
        };
    }
  }, getDefaultAggregate());
};

export const loadAbandonAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<Abandon, AbandonEvent>(
      createAbandonAggregateId(identifiantProjet),
      abandonAggregateFactory,
    );
  };
};

const createAbandon = (aggregate: Abandon, payload: AbandonDemandéEvent['payload']) => {
  const { recandidature, piéceJustificative, raison, demandéLe: dateAbandon } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
    demande: {
      recandidature,
      piéceJustificative,
      raison,
      demandéLe: convertirEnDateTime(dateAbandon),
    },
    rejet: undefined,
    accord: undefined,
  };
  return newAggregate;
};

const updateAvecRejet = (aggregate: Abandon, payload: AbandonRejetéEvent['payload']) => {
  const { rejetéLe, réponseSignée } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
    rejet: {
      rejetéLe: convertirEnDateTime(rejetéLe),
      réponseSignée,
    },
    accord: undefined,
  };
  return newAggregate;
};

const updateAvecAcceptation = (aggregate: Abandon, payload: AbandonAccordéEvent['payload']) => {
  const { acceptéLe, réponseSignée } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
    rejet: undefined,
    accord: {
      accordéLe: convertirEnDateTime(acceptéLe),
      réponseSignée,
    },
  };
  return newAggregate;
};

const updateAvecConfirmationAbandonDemandé = (
  aggregate: Abandon,
  payload: ConfirmationAbandonDemandéEvent['payload'],
) => {
  const { confirmationDemandéLe, réponseSignée } = payload;
  let newAggregate: Abandon = {
    ...aggregate,
  };

  newAggregate.demande.confirmation = {
    demandéLe: convertirEnDateTime(confirmationDemandéLe),
    réponseSignée,
  };

  return newAggregate;
};

const updateAvecAbandonConfirmé = (
  aggregate: Abandon,
  payload: AbandonConfirméEvent['payload'],
) => {
  const { confirméLe } = payload;
  let newAggregate: Abandon = {
    ...aggregate,
  };

  if (newAggregate.demande.confirmation) {
    newAggregate.demande.confirmation.confirméLe = convertirEnDateTime(confirméLe);
  } else {
    // TODO: Log warning
  }

  return newAggregate;
};
