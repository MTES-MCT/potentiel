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
      case 'GarantiesFinancièresSnapshot':
        return {
          ...aggregate,
          ...(event.payload.aggregate.actuelles && {
            actuelles: {
              typeGarantiesFinancières: event.payload.aggregate.actuelles.typeGarantiesFinancières,
              ...(event.payload.aggregate.actuelles.dateÉchéance && {
                dateÉchéance: convertirEnDateTime(event.payload.aggregate.actuelles.dateÉchéance),
              }),
              attestationConstitution: {
                format: event.payload.aggregate.actuelles.attestationConstitution?.format,
                date:
                  event.payload.aggregate.actuelles.attestationConstitution?.date &&
                  convertirEnDateTime(
                    event.payload.aggregate.actuelles.attestationConstitution?.date,
                  ),
              },
            },
          }),
          ...(event.payload.aggregate.dépôt && {
            dépôt: {
              typeGarantiesFinancières: event.payload.aggregate.dépôt.typeGarantiesFinancières,
              ...(event.payload.aggregate.dépôt.dateÉchéance && {
                dateÉchéance: convertirEnDateTime(event.payload.aggregate.dépôt.dateÉchéance),
              }),
              attestationConstitution: {
                format: event.payload.aggregate.dépôt.attestationConstitution?.format,
                date:
                  event.payload.aggregate.dépôt.attestationConstitution?.date &&
                  convertirEnDateTime(event.payload.aggregate.dépôt.attestationConstitution?.date),
              },
              dateDépôt: convertirEnDateTime(event.payload.aggregate.dépôt.dateDépôt),
            },
          }),
          ...(event.payload.aggregate.dépôt && {}),
        };
      case 'TypeGarantiesFinancièresEnregistré':
      case 'AttestationGarantiesFinancièresEnregistrée':
        return processEnregistrementGarantiesFinancièresEvent({ event, aggregate });
      case 'GarantiesFinancièresDéposées':
      case 'DépôtGarantiesFinancièresModifié':
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
    default:
      return { ...aggregate };
  }
};
