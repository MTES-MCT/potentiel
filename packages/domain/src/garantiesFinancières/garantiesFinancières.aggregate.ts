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
      case 'TypeGarantiesFinancièresEnregistréSnapshot-v1':
      case 'TypeGarantiesFinancièresEnregistré-v1':
      case 'AttestationGarantiesFinancièresEnregistrée':
        return processEnregistrementGarantiesFinancièresEvent({ event, aggregate });
      case 'GarantiesFinancièresDéposées-v1':
      case 'DépôtGarantiesFinancièresModifié-v1':
      case 'GarantiesFinancièresDéposéesSnapshot-v1':
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
    case 'TypeGarantiesFinancièresEnregistréSnapshot-v1':
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
    case 'TypeGarantiesFinancièresEnregistré-v1':
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
    case 'GarantiesFinancièresDéposées-v1':
    case 'DépôtGarantiesFinancièresModifié-v1':
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
    case 'GarantiesFinancièresDéposéesSnapshot-v1':
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
