import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjetValueType, convertirEnDateTime } from '../domain.valueType';
import { DépôtGarantiesFinancières, GarantiesFinancières } from './garantiesFinancières.valueType';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
} from './garantiesFinancières.event';

type GarantiesFinancièresAggregateId = `garanties-financières|${string}`;

export const createGarantiesFinancièresAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): GarantiesFinancièresAggregateId => `garanties-financières|${identifiantProjet.formatter()}`;

export type GarantiesFinancièresAggregate = {
  dépôt?: Partial<DépôtGarantiesFinancières>;
  actuelles?: GarantiesFinancières;
};

const garantiesFinancièresAggregateFactory: AggregateFactory<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = (events) =>
  events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'TypeGarantiesFinancièresEnregistréSnapshot':
      case 'TypeGarantiesFinancièresEnregistré':
      case 'AttestationGarantiesFinancièresEnregistrée':
        return processEnregistrementGarantiesFinancièresEvent({ event, aggregate });
      case 'GarantiesFinancièresDéposées':
      case 'DépôtGarantiesFinancièresModifié':
      case 'GarantiesFinancièresDéposéesSnapshot':
        return processDépôtGarantiesFinancièresEvent({ event, aggregate });
      default:
        return { ...aggregate };
    }
  }, {});

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadGarantiesFinancièresAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<GarantiesFinancièresAggregate, GarantiesFinancièresEvent>(
      createGarantiesFinancièresAggregateId(identifiantProjet),
      garantiesFinancièresAggregateFactory,
    );
  };
};

const processEnregistrementGarantiesFinancièresEvent = ({
  event,
  aggregate,
}: {
  event: EnregistrementGarantiesFinancièresEvent;
  aggregate: GarantiesFinancièresAggregate;
}) => {
  switch (event.type) {
    case 'TypeGarantiesFinancièresEnregistréSnapshot':
      if ('typeGarantiesFinancières' in event.payload) {
        return {
          ...aggregate,
          actuelles: {
            ...aggregate.actuelles,
            typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
            dateÉchéance:
              event.payload.typeGarantiesFinancières === `avec date d'échéance`
                ? convertirEnDateTime(event.payload.dateÉchéance)
                : undefined,
          },
        };
      } else {
        return {
          ...aggregate,
          actuelles: {
            ...aggregate.actuelles,
            dateÉchéance: convertirEnDateTime(event.payload.dateÉchéance),
          },
        };
      }
    case 'TypeGarantiesFinancièresEnregistré':
      return {
        ...aggregate,
        actuelles: {
          ...aggregate.actuelles,
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance:
            event.payload.typeGarantiesFinancières === `avec date d'échéance`
              ? convertirEnDateTime(event.payload.dateÉchéance)
              : undefined,
        },
      };
    case 'AttestationGarantiesFinancièresEnregistrée':
      return {
        ...aggregate,
        actuelles: {
          ...aggregate.actuelles,
          attestationConstitution: {
            format: event.payload.format,
            date: convertirEnDateTime(event.payload.date),
          },
        },
      };
    default:
      return { ...aggregate };
  }
};

const processDépôtGarantiesFinancièresEvent = ({
  event,
  aggregate,
}: {
  event: DépôtGarantiesFinancièresEvent;
  aggregate: GarantiesFinancièresAggregate;
}) => {
  switch (event.type) {
    case 'GarantiesFinancièresDéposées':
    case 'DépôtGarantiesFinancièresModifié':
      return {
        ...aggregate,
        dépôt: {
          ...(aggregate && { ...aggregate.dépôt }),
          ...('dateDépôt' in event.payload && {
            dateDépôt: convertirEnDateTime(event.payload.dateDépôt),
          }),
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
    case 'GarantiesFinancièresDéposéesSnapshot':
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
    default:
      return { ...aggregate };
  }
};
