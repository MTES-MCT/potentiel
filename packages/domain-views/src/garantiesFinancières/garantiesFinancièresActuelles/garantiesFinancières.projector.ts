import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from './garantiesFinancières.readModel';
import { EnregistrementGarantiesFinancièresEvent } from '@potentiel/domain';
import { Create, Find, Update } from '@potentiel/core-domain-views';

export type ExecuteGarantiesFinancièresProjector = Message<
  'EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR',
  EnregistrementGarantiesFinancièresEvent
>;

export type GarantiesFinancièresProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
};

export const registerGarantiesFinancièresProjector = ({
  create,
  update,
  find,
}: GarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGarantiesFinancièresProjector> = async (event) => {
    const key: GarantiesFinancièresReadModelKey = `garanties-financières|${event.payload.identifiantProjet}`;
    const garantiesFinancières = await find<GarantiesFinancièresReadModel>(key);
    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (!event.payload.aggregate.actuelles) {
          break;
        }

        if (isNone(garantiesFinancières)) {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution } =
            event.payload.aggregate.actuelles;
          await create<GarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières: typeGarantiesFinancières || undefined,
            dateÉchéance: dateÉchéance || undefined,
            attestationConstitution,
          });
        } else {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution } =
            event.payload.aggregate.actuelles;
          await update<GarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières: typeGarantiesFinancières || undefined,
            dateÉchéance: dateÉchéance || undefined,
            attestationConstitution,
          });
        }
        break;
      case 'TypeGarantiesFinancièresEnregistré-v1':
        if (isNone(garantiesFinancières)) {
          await create<GarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières:
              'typeGarantiesFinancières' in event.payload
                ? event.payload.typeGarantiesFinancières
                : undefined,
            dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          });
        } else {
          await update<GarantiesFinancièresReadModel>(key, {
            ...garantiesFinancières,
            typeGarantiesFinancières:
              'typeGarantiesFinancières' in event.payload
                ? event.payload.typeGarantiesFinancières
                : undefined,
            dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          });
        }
        break;
      case 'AttestationGarantiesFinancièresEnregistrée-v1':
        if (isNone(garantiesFinancières)) {
          await create<GarantiesFinancièresReadModel>(key, {
            attestationConstitution: {
              format: event.payload.format,
              date: event.payload.date,
            },
          });
        } else {
          await update<GarantiesFinancièresReadModel>(key, {
            ...garantiesFinancières,
            attestationConstitution: {
              format: event.payload.format,
              date: event.payload.date,
            },
          });
        }
        break;
    }
  };

  mediator.register('EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
