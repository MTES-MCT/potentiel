import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { DépôtGarantiesFinancièresEvent } from '../domain.events';
import { IdentifiantProjetValueType, convertirEnDateTime } from '../domain.valueType';
import { DépôtGarantiesFinancières } from './garantiesFinancières.valueType';

type DépôtGarantiesFinancièresAggregateId = `dépôt-garanties-financières|${string}`;

export const createDépôtGarantiesFinancièresAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): DépôtGarantiesFinancièresAggregateId =>
  `dépôt-garanties-financières|${identifiantProjet.formatter()}`;

type GarantiesFinancièresAggregate = { dépôt?: Partial<DépôtGarantiesFinancières> };

const dépôtGarantiesFinancièresAggregateFactory: AggregateFactory<
  GarantiesFinancièresAggregate,
  DépôtGarantiesFinancièresEvent
> = (events) =>
  events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GarantiesFinancièresDéposées-v1':
        return {
          ...aggregate,
          dépôt: {
            dateDépôt: convertirEnDateTime(event.payload.dateDépôt),
            typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
            dateÉchéance:
              'dateÉchéance' in event.payload
                ? convertirEnDateTime(event.payload.dateÉchéance)
                : undefined,
            attestationConstitution: {
              format: event.payload.attestationConstitution.format,
              date: convertirEnDateTime(event.payload.attestationConstitution.date),
            },
          },
        };
      case 'GarantiesFinancièresDéposées-v0':
        return {
          ...aggregate,
          dépôt: {
            dateDépôt: convertirEnDateTime(event.payload.dateDépôt),
            ...('typeGarantiesFinancières' in event.payload && {
              typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
            }),
            dateÉchéance: event.payload.dateÉchéance
              ? convertirEnDateTime(event.payload.dateÉchéance)
              : undefined,
            attestationConstitution: {
              format: event.payload.attestationConstitution.format,
              date: convertirEnDateTime(event.payload.attestationConstitution.date),
            },
          },
        };
    }
  }, {});

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadDépôtGarantiesFinancièresAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<GarantiesFinancièresAggregate, DépôtGarantiesFinancièresEvent>(
      createDépôtGarantiesFinancièresAggregateId(identifiantProjet),
      dépôtGarantiesFinancièresAggregateFactory,
    );
  };
};
