import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjetValueType } from '../../projet.valueType';
import {
  AbandonDemandéEvent,
  AbandonEvent,
  AbandonAccordéEvent,
  AbandonRejetéEvent,
  ConfirmationAbandonDemandéeEvent,
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
      case 'ConfirmationAbandonDemandée-V1':
        return updateAvecConfirmationAbandonDemandée(aggregate, payload);
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
  const { recandidature, pièceJustificative, raison, demandéLe: dateAbandon } = payload;
  const newAggregate: Abandon = {
    ...aggregate,
    demande: {
      recandidature,
      pièceJustificative,
      raison,
      demandéLe: convertirEnDateTime(dateAbandon),
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

const updateAvecConfirmationAbandonDemandée = (
  aggregate: Abandon,
  payload: ConfirmationAbandonDemandéeEvent['payload'],
) => {
  const { confirmationDemandéeLe, réponseSignée } = payload;
  let newAggregate: Abandon = {
    ...aggregate,
  };

  newAggregate.demande.confirmation = {
    demandéLe: convertirEnDateTime(confirmationDemandéeLe),
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
