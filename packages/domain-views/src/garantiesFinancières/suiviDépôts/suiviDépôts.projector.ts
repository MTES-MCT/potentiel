import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';

import {
  SuiviDépôtsGarantiesFinancièresEvent,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { Create, Find, Remove, Update } from '@potentiel/core-domain-views';
import {
  SuiviDépôtGarantiesFinancièresReadModel,
  SuiviDépôtGarantiesFinancièresReadModelKey,
} from './suiviDépôts.readModel';
import { RécupérerDétailProjetPort } from '../../domainViews.port';

export type ExecuteSuiviDépôtsGarantiesFinancièresProjector = Message<
  'SUIVI_DÉPÔTS_GARANTIES_FINANCIÈRES_PROJECTOR',
  SuiviDépôtsGarantiesFinancièresEvent
>;

export type SuiviDépôtsGarantiesFinancièresProjectorDependencies = {
  create: Create;
  find: Find;
  update: Update;
  remove: Remove;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerSuiviDépôtsGarantiesFinancièresProjector = ({
  create,
  find,
  update,
  récupérerDétailProjet,
  remove,
}: SuiviDépôtsGarantiesFinancièresProjectorDependencies) => {
  const handler: MessageHandler<ExecuteSuiviDépôtsGarantiesFinancièresProjector> = async (
    event,
  ) => {
    const actualReadModelKey: SuiviDépôtGarantiesFinancièresReadModelKey = `suivi-dépôt-garanties-financières|${event.payload.identifiantProjet}`;
    const actualReadModel = await find<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey);

    const getRégionsProjet = async (identifiantProjet: RawIdentifiantProjet) => {
      const projet = await récupérerDétailProjet(convertirEnIdentifiantProjet(identifiantProjet));
      if (isSome(projet)) {
        return projet.localité.région;
      } else {
        // TODO: logger error
        return 'REGION INCONNUE';
      }
    };
    const région = await getRégionsProjet(event.payload.identifiantProjet);

    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (event.payload.aggregate.dépôt) {
          const { dateLimiteDépôt } = event.payload.aggregate;
          const readModel = {
            dateLimiteDépôt: dateLimiteDépôt === 'Date inconnue' ? undefined : dateLimiteDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
            statutDépôt: 'en cours' as const,
          };
          if (isSome(actualReadModel)) {
            return update<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, readModel);
          }
          return create<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, readModel);
        } else if (event.payload.aggregate.dateLimiteDépôt) {
          const readModel = {
            dateLimiteDépôt: event.payload.aggregate.dateLimiteDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
            statutDépôt: 'en attente' as const,
          };
          if (isSome(actualReadModel)) {
            return update<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, readModel);
          }
          if (isNone(actualReadModel)) {
            return create<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, readModel);
          }
        }

        break;
      case 'GarantiesFinancièresDéposées-v1':
        if (isSome(actualReadModel)) {
          await update<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, {
            ...actualReadModel,
            statutDépôt: 'en cours',
          });
        }
        break;
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        if (isSome(actualReadModel)) {
          if (actualReadModel.dateLimiteDépôt) {
            await update<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, {
              ...actualReadModel,
              statutDépôt: 'en attente',
            });
          } else {
            await remove<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey);
          }
        }
        break;
      case 'DépôtGarantiesFinancièresValidé-v1':
        if (isSome(actualReadModel)) {
          await update<SuiviDépôtGarantiesFinancièresReadModel>(actualReadModelKey, {
            ...actualReadModel,
            dateLimiteDépôt: undefined,
            statutDépôt: 'validé',
          });
        }
        break;
    }
  };

  mediator.register('SUIVI_DÉPÔTS_GARANTIES_FINANCIÈRES_PROJECTOR', handler);
};
