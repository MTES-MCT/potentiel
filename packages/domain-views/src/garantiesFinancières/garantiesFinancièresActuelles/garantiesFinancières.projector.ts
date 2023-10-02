import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from './garantiesFinancières.readModel';
import { EnregistrementGarantiesFinancièresEvent } from '@potentiel/domain';
import { Create, Find, RebuildTriggered, Remove, Update } from '@potentiel/core-domain-views';

export type ExecuteGarantiesFinancièresProjector = Message<
  'EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR',
  EnregistrementGarantiesFinancièresEvent | RebuildTriggered
>;

export type GarantiesFinancièresProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
  remove: Remove;
};

export const registerGarantiesFinancièresProjector = ({
  create,
  update,
  find,
  remove,
}: GarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGarantiesFinancièresProjector> = async (event) => {
    if (event.type === 'RebuildTriggered') {
      return remove<GarantiesFinancièresReadModel>(`garanties-financières|${event.payload.id}`);
    }
    const key: GarantiesFinancièresReadModelKey = `garanties-financières|${event.payload.identifiantProjet}`;
    const garantiesFinancières = await find<GarantiesFinancièresReadModel>(key);
    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (event.payload.aggregate.actuelles) {
          const { typeGarantiesFinancières, attestationConstitution, dateÉchéance } =
            event.payload.aggregate.actuelles;
          const readModel = {
            typeGarantiesFinancières:
              typeGarantiesFinancières === 'Type inconnu' ? undefined : typeGarantiesFinancières,
            dateÉchéance: dateÉchéance === 'Date inconnue' ? undefined : dateÉchéance,
            attestationConstitution:
              'attestationAbsente' in attestationConstitution ? undefined : attestationConstitution,
          };
          if (isNone(garantiesFinancières)) {
            await create<GarantiesFinancièresReadModel>(key, readModel);
          } else {
            await update<GarantiesFinancièresReadModel>(key, readModel);
          }
        }
        break;
      case 'TypeGarantiesFinancièresImporté-v1':
        if (isNone(garantiesFinancières)) {
          await create<GarantiesFinancièresReadModel>(key, {
            typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
            dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
          });
        } else {
          //TODO : logger erreur > à l'import du projet il ne peut pas déjà avoir des GF
        }
        break;
      case 'GarantiesFinancièresEnregistrées-v1':
        const readModel = {
          attestationConstitution: {
            format: event.payload.attestationConstitution.format,
            date: event.payload.attestationConstitution.date,
          },
          typeGarantiesFinancières: event.payload.typeGarantiesFinancières,
          dateÉchéance: 'dateÉchéance' in event.payload ? event.payload.dateÉchéance : undefined,
        };

        if (isNone(garantiesFinancières)) {
          await create<GarantiesFinancièresReadModel>(key, readModel);
        } else {
          await update<GarantiesFinancièresReadModel>(key, readModel);
        }
        break;
    }
  };

  mediator.register('EXECUTE_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
