import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from './garantiesFinancières.readModel';
import { Create, Update, Find } from '../common.port';
import { EnregistrementGarantiesFinancièresEvent } from '@potentiel/domain';

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
      case 'GarantiesFinancièresSnapshot':
        if (!event.payload.aggregate.actuelles) {
          return;
        }
        if (isNone(garantiesFinancières)) {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution } =
            event.payload.aggregate.actuelles;
          await create<GarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières,
            dateÉchéance,
            attestationConstitution,
          });
        } else {
          // TO DO : ce cas ne devrait pas arriver, erreur à logguer ?
        }
        break;
      case 'TypeGarantiesFinancièresEnregistré':
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
      case 'AttestationGarantiesFinancièresEnregistrée':
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
