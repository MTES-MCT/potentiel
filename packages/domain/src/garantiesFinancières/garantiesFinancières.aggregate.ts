import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  DateTimeValueType,
  IdentifiantProjetValueType,
  convertirEnDateTime,
} from '../domain.valueType';
import { DépôtGarantiesFinancières, GarantiesFinancières } from './garantiesFinancières.valueType';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
} from './garantiesFinancières.event';
import { GarantiesFinancièresSnapshotEventV1 } from '../domain.events';

type GarantiesFinancièresAggregateId = `garanties-financières|${string}`;

export const createGarantiesFinancièresAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): GarantiesFinancièresAggregateId => `garanties-financières|${identifiantProjet.formatter()}`;

export type GarantiesFinancièresAggregate = {
  dépôt?: Partial<DépôtGarantiesFinancières>;
  actuelles?: GarantiesFinancières;
  dateLimiteDépôt?: DateTimeValueType;
};

const garantiesFinancièresAggregateFactory: AggregateFactory<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = (events) =>
  events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        return processGarantiesFinancièresSnapshotEvent({ event, aggregate });
      case 'TypeGarantiesFinancièresEnregistré-v1':
      case 'AttestationGarantiesFinancièresEnregistrée-v1':
        return processEnregistrementGarantiesFinancièresEvents({ event, aggregate });
      case 'GarantiesFinancièresDéposées-v1':
      case 'DépôtGarantiesFinancièresModifié-v1':
        return processDépôtGarantiesFinancièresEvents({ event, aggregate });
      case 'DépôtGarantiesFinancièresValidé-v1':
        return processDépôtGarantiesFinancièresValidéEvent({ aggregate });
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        return processDépôtGarantiesFinancièresSuppriméEvent({ aggregate });
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

const processEnregistrementGarantiesFinancièresEvents = ({
  event,
  aggregate,
}: {
  event: EnregistrementGarantiesFinancièresEvent;
  aggregate: GarantiesFinancièresAggregate;
}): GarantiesFinancièresAggregate => {
  switch (event.type) {
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
    case 'AttestationGarantiesFinancièresEnregistrée-v1':
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

const processDépôtGarantiesFinancièresEvents = ({
  event,
  aggregate,
}: {
  event: DépôtGarantiesFinancièresEvent;
  aggregate: GarantiesFinancièresAggregate;
}): GarantiesFinancièresAggregate => {
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
    default:
      return { ...aggregate };
  }
};

const processGarantiesFinancièresSnapshotEvent = ({
  event,
  aggregate,
}: {
  event: GarantiesFinancièresSnapshotEventV1;
  aggregate: GarantiesFinancièresAggregate;
}): GarantiesFinancièresAggregate => {
  let dépôt: GarantiesFinancièresAggregate['dépôt'];
  let actuelles: GarantiesFinancièresAggregate['actuelles'];

  if (event.payload.aggregate.actuelles) {
    const { typeGarantiesFinancières, dateÉchéance, attestationConstitution } =
      event.payload.aggregate.actuelles;
    actuelles = {
      typeGarantiesFinancières,
      ...(attestationConstitution && {
        attestationConstitution: {
          format: attestationConstitution.format,
          date: convertirEnDateTime(attestationConstitution.date),
        },
      }),
      ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
    };
  }

  if (event.payload.aggregate.dépôt) {
    const { typeGarantiesFinancières, dateÉchéance, attestationConstitution, dateDépôt } =
      event.payload.aggregate.dépôt;
    dépôt = {
      typeGarantiesFinancières,
      ...(attestationConstitution && {
        attestationConstitution: {
          format: attestationConstitution.format,
          date: convertirEnDateTime(attestationConstitution.date),
        },
      }),
      ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
      dateDépôt: convertirEnDateTime(dateDépôt),
    };
  }

  return {
    ...aggregate,
    dépôt,
    actuelles,
    ...(event.payload.aggregate.dateLimiteDépôt && {
      dateLimiteDépôt: convertirEnDateTime(event.payload.aggregate.dateLimiteDépôt),
    }),
  };
};

const processDépôtGarantiesFinancièresValidéEvent = ({
  aggregate,
}: {
  aggregate: GarantiesFinancièresAggregate;
}) => {
  return { ...aggregate, dateLimiteDépôt: undefined };
};

const processDépôtGarantiesFinancièresSuppriméEvent = ({
  aggregate,
}: {
  aggregate: GarantiesFinancièresAggregate;
}) => {
  return { ...aggregate, dépôt: undefined };
};
