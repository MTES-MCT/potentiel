import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';

import {
  GarantiesFinancièresÀDéposerEvent,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { Create, Find, Update } from '@potentiel/core-domain-views';
import {
  GarantiesFinancièresÀDéposerReadModel,
  GarantiesFinancièresÀDéposerReadModelKey,
} from './garantiesFinancièresÀDéposer.readModel';
import { RécupérerDétailProjetPort } from '../../domainViews.port';

export type ExecuteGarantiesFinancièresÀDéposerProjector = Message<
  'GARANTIES_FINANCIÈRES_À_DÉPOSER_PROJECTOR',
  GarantiesFinancièresÀDéposerEvent
>;

export type GarantiesFinancièresÀDéposerProjectorDependencies = {
  create: Create;
  find: Find;
  update: Update;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerGarantiesFinancièresÀDéposerProjector = ({
  create,
  find,
  update,
  récupérerDétailProjet,
}: GarantiesFinancièresÀDéposerProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGarantiesFinancièresÀDéposerProjector> = async (event) => {
    const actualReadModelKey: GarantiesFinancièresÀDéposerReadModelKey = `garanties-financières-à-déposer|${event.payload.identifiantProjet}`;
    const actualReadModel = await find<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey);

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
          if (isSome(actualReadModel)) {
            // TODO : erreur à logguer
          }
          return create<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
            dateLimiteDépôt: event.payload.aggregate.dateLimiteDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
            statutDépôt: 'en cours',
          });
        } else if (event.payload.aggregate.dateLimiteDépôt) {
          if (isSome(actualReadModel)) {
            // TODO : erreur à logguer
          }

          if (isNone(actualReadModel)) {
            await create<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
              dateLimiteDépôt: event.payload.aggregate.dateLimiteDépôt,
              région,
              identifiantProjet: event.payload.identifiantProjet,
              statutDépôt: 'en attente',
            });
          }
        }

        break;
      case 'GarantiesFinancièresDéposées-v1':
        if (isSome(actualReadModel)) {
          await update<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
            ...actualReadModel,
            statutDépôt: 'en cours',
          });
        }
        break;
      case 'DépôtGarantiesFinancièresSupprimé-v1':
        if (isSome(actualReadModel)) {
          await update<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
            ...actualReadModel,
            statutDépôt: 'en attente',
          });
        }
        break;
      case 'DépôtGarantiesFinancièresValidé-v1':
        if (isSome(actualReadModel)) {
          await update<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
            ...actualReadModel,
            statutDépôt: 'validé',
          });
        }
        break;
    }
  };

  mediator.register('GARANTIES_FINANCIÈRES_À_DÉPOSER_PROJECTOR', handler);
};
