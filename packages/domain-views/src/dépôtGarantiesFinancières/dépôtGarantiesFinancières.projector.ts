import { Message, MessageHandler, mediator } from 'mediateur';
import { isSome } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
} from './dépôtGarantiesFinancières.readModel';
import { Create, Update, Find } from '../common.port';
import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';

export type ExecuteDépôtGarantiesFinancièresProjector = Message<
  'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR',
  DépôtGarantiesFinancièresEvent
>;

export type DépôtGarantiesFinancièresProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
};

export const registerDépôtGarantiesFinancièresProjector = ({
  create,
  update,
  find,
}: DépôtGarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteDépôtGarantiesFinancièresProjector> = async (event) => {
    const key: DépôtGarantiesFinancièresReadModelKey = `dépôt-garanties-financières|${
      event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
    }`;
    const dépôtGarantiesFinancières = await find<DépôtGarantiesFinancièresReadModel>(key);

    switch (event.type) {
      case 'GarantiesFinancièresDéposées-v1':
      case 'GarantiesFinancièresDéposées-v0':
        if (isSome(dépôtGarantiesFinancières)) {
          await update<DépôtGarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières:
              'typeGarantiesFinancières' in event.payload
                ? event.payload.typeGarantiesFinancières
                : undefined,
            dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
            attestationConstitution: {
              format: event.payload.attestationConstitution.format,
              date: event.payload.attestationConstitution.date,
            },
            dateDépôt: event.payload.dateDépôt,
          });
          break;
        }
        await create<DépôtGarantiesFinancièresReadModel>(key, {
          typeGarantiesFinancières:
            'typeGarantiesFinancières' in event.payload
              ? event.payload.typeGarantiesFinancières
              : undefined,
          dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
          dateDépôt: event.payload.dateDépôt,
        });
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
