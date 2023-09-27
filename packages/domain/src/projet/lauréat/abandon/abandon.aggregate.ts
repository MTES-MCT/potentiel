import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjetValueType } from '../../projet.valueType';
import { AbandonEvent } from './abandon.event';

type AbandonAggregateId = `abandon|${string}`;

export const createAbandonAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): AbandonAggregateId => {
  return `abandon|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Abandon = {
  raison: string;
  piéceJustificative: {
    format: string;
  };
  recandidature: boolean;
  typeAbandon: 'recandidature';
};

const getDefaultAggregate = (): Abandon => ({
  raison: '',
  piéceJustificative: {
    format: '',
  },
  recandidature: true,
  typeAbandon: 'recandidature',
});

const abandonAggregateFactory: AggregateFactory<Abandon, AbandonEvent> = (events) => {
  return events.reduce((aggregate, { type, payload }) => {
    switch (type) {
      case 'AbandonDemandé':
        const { recandidature, piéceJustificative, raison } = payload;
        return {
          ...aggregate,
          recandidature,
          piéceJustificative,
          raison,
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
