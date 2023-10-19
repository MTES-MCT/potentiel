import { AggregateFactory, LoadAggregate } from '@potentiel-domain/core';
import {
  AbandonDemandéEvent,
  AbandonEvent,
  AbandonAccordéEvent,
  AbandonRejetéEvent,
  ConfirmationAbandonDemandéeEvent,
  AbandonConfirméEvent,
} from './abandon.event';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { StatutAbandon } from './statusAbandon.valueType';

type AbandonAggregateId = `abandon|${string}`;

export const createAbandonAggregateId = (
  identifiantProjet: IdentifiantProjet.ValueType,
): AbandonAggregateId => {
  return `abandon|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Abandon = {
  getStatut: () => StatutAbandon;
  estAccordé: () => boolean;
  estRejeté: () => boolean;
  estEnAttenteConfirmation: () => boolean;
  estConfirmé: () => boolean;
  estEnCours: () => boolean;
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
};

const getDefaultAggregate = (): Abandon => ({
  estAccordé() {
    return this.getStatut() === 'accordé';
  },
  estEnCours() {
    const statusEnCours: Array<StatutAbandon> = ['confirmation-demandée', 'confirmé', 'demandé'];
    return statusEnCours.includes(this.getStatut());
  },
  estRejeté() {
    return this.getStatut() === 'rejeté';
  },
  estEnAttenteConfirmation() {
    return this.getStatut() === 'confirmation-demandée';
  },
  estConfirmé() {
    return this.getStatut() === 'confirmé';
  },
  getStatut() {
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
      return 'confirmation-demandée';
    }

    if (this.demande.confirmation && this.demande.confirmation.confirméLe) {
      return 'confirmé';
    }

    return 'demandé';
  },
  demande: {
    raison: '',
    pièceJustificative: {
      format: '',
    },
    recandidature: false,
    demandéLe: DateTime.convertirEnValueType(new Date()),
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
      case 'ConfirmationAbandonDemandée-V1':
        return updateAvecConfirmationAbandonDemandée(aggregate, payload);
      case 'AbandonConfirmé-V1':
        return updateAvecAbandonConfirmé(aggregate, payload);
      case 'AbandonAnnulé-V1':
        const { annuléLe } = payload;
        return {
          annuléLe: DateTime.convertirEnValueType(annuléLe),
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
  return async (identifiantProjet: IdentifiantProjet.ValueType) => {
    return loadAggregate<Abandon, AbandonEvent>(
      createAbandonAggregateId(identifiantProjet),
      abandonAggregateFactory,
    );
  };
};

const createAbandon = (aggregate: Abandon, payload: AbandonDemandéEvent['payload']) => {
  const { recandidature, pièceJustificative, raison, demandéLe: dateAbandon } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
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

const updateAvecRejet = (aggregate: Abandon, payload: AbandonRejetéEvent['payload']) => {
  const { rejetéLe, réponseSignée } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
    rejet: {
      rejetéLe: DateTime.convertirEnValueType(rejetéLe),
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
      accordéLe: DateTime.convertirEnValueType(acceptéLe),
      réponseSignée,
    },
  };
  return newAggregate;
};

const updateAvecConfirmationAbandonDemandée = (
  aggregate: Abandon,
  payload: ConfirmationAbandonDemandéeEvent['payload'],
) => {
  const { confirmationDemandéeLe, réponseSignée } = payload;
  let newAggregate: Abandon = {
    ...aggregate,
  };

  newAggregate.demande.confirmation = {
    demandéLe: DateTime.convertirEnValueType(confirmationDemandéeLe),
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
    newAggregate.demande.confirmation.confirméLe = DateTime.convertirEnValueType(confirméLe);
  } else {
    // TODO: Log warning
  }

  return newAggregate;
};
