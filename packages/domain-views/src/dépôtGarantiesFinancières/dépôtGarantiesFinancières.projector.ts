import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
} from './dépôtGarantiesFinancières.readModel';
import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from '../domainViews.readModel';
import { Create, Update, Find, Remove } from '@potentiel/core-domain';

export type ExecuteDépôtGarantiesFinancièresProjector = Message<
  'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR',
  DépôtGarantiesFinancièresEvent
>;

export type DépôtGarantiesFinancièresProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
  remove: Remove;
};

export const registerDépôtGarantiesFinancièresProjector = ({
  create,
  update,
  find,
  remove,
}: DépôtGarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteDépôtGarantiesFinancièresProjector> = async (event) => {
    const key: DépôtGarantiesFinancièresReadModelKey = `dépôt-garanties-financières|${event.payload.identifiantProjet}`;
    const dépôtGarantiesFinancières = await find<DépôtGarantiesFinancièresReadModel>(key);

    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (!event.payload.aggregate.dépôt) {
          return;
        }
        if (isNone(dépôtGarantiesFinancières)) {
          const { typeGarantiesFinancières, dateÉchéance, attestationConstitution, dateDépôt } =
            event.payload.aggregate.dépôt;
          await create<DépôtGarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières,
            dateÉchéance,
            attestationConstitution,
            dateDépôt,
          });
        } else {
          // TO DO : ce cas ne devrait pas arriver, erreur à logguer ?
        }
        break;
      case 'GarantiesFinancièresDéposées-v1':
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
      case 'DépôtGarantiesFinancièresModifié-v1':
        if (isNone(dépôtGarantiesFinancières)) {
          // ne devrait pas arriver
          break;
        }
        await update<DépôtGarantiesFinancièresReadModel>(key, {
          ...dépôtGarantiesFinancières,
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
        });
        break;
      case 'DépôtGarantiesFinancièresValidé-v1':
        // enregistrer GF
        const garantiesFinancièresActuellesKey: GarantiesFinancièresReadModelKey = `garanties-financières|${event.payload.identifiantProjet}`;
        const garantiesFinancièresActuelles = await find<GarantiesFinancièresReadModel>(
          garantiesFinancièresActuellesKey,
        );

        if (isSome(dépôtGarantiesFinancières)) {
          const garantiesFinancières = {
            typeGarantiesFinancières: dépôtGarantiesFinancières.typeGarantiesFinancières,
            dateÉchéance: dépôtGarantiesFinancières.dateÉchéance,
            attestationConstitution: {
              format: dépôtGarantiesFinancières.attestationConstitution.format,
              date: dépôtGarantiesFinancières.attestationConstitution.date,
            },
          };
          if (isSome(garantiesFinancièresActuelles)) {
            await update<GarantiesFinancièresReadModel>(
              garantiesFinancièresActuellesKey,
              garantiesFinancières,
            );
          } else {
            await create<GarantiesFinancièresReadModel>(
              garantiesFinancièresActuellesKey,
              garantiesFinancières,
            );
          }
        } else {
          // TODO : ce cas ne devrait pas arriver - logguer erreur si pas de dépôt
        }

        await remove<DépôtGarantiesFinancièresReadModel>(key);
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        await remove<DépôtGarantiesFinancièresReadModel>(key);
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
