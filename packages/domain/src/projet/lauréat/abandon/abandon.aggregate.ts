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
  avecRecandidature: boolean;
  typeAbandon: 'recandidature';
};

const getDefaultAggregate = (): Abandon => ({
  raison: '',
  piéceJustificative: {
    format: '',
  },
  avecRecandidature: true,
  typeAbandon: 'recandidature',
});

const abandonAggregateFactory: AggregateFactory<Abandon, AbandonEvent> = (events) => {
  return events.reduce((aggregate, { type, payload }) => {
    switch (type) {
      case 'AbandonDemandé':
        const { avecRecandidature, piéceJustificative, raison } = payload;
        return {
          ...aggregate,
          avecRecandidature,
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
