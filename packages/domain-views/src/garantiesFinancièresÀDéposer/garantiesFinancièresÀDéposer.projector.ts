import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';

import {
  GarantiesFinancièresÀDéposerEvent,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { Create, Find } from '@potentiel/core-domain';
import { RécupérerDétailProjetPort } from '../domainViews.port';
import {
  GarantiesFinancièresÀDéposerReadModel,
  GarantiesFinancièresÀDéposerReadModelKey,
} from './garantiesFinancièresÀDéposer.readModel';

export type ExecuteGarantiesFinancièresÀDéposerProjector = Message<
  'GARANTIES_FINANCIÈRES_À_DÉPOSER_PROJECTOR',
  GarantiesFinancièresÀDéposerEvent
>;

export type GarantiesFinancièresÀDéposerProjectorDependencies = {
  create: Create;
  find: Find;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerGarantiesFinancièresÀDéposerProjector = ({
  create,
  find,
  récupérerDétailProjet,
}: GarantiesFinancièresÀDéposerProjectorDependencies) => {
  const handler: MessageHandler<ExecuteGarantiesFinancièresÀDéposerProjector> = async (event) => {
    const actualReadModelKey: GarantiesFinancièresÀDéposerReadModelKey = `garanties-financières-à-déposer|${event.payload.identifiantProjet}`;
    const getRégionsProjet = async (identifiantProjet: RawIdentifiantProjet) => {
      const projet = await récupérerDétailProjet(convertirEnIdentifiantProjet(identifiantProjet));
      if (isSome(projet)) {
        return projet.localité.région;
      } else {
        // TODO: logger error
        return 'REGION INCONNUE';
      }
    };

    switch (event.type) {
      case 'GarantiesFinancièresSnapshot-v1':
        if (event.payload.aggregate.dépôt || !event.payload.aggregate.dateLimiteDépôt) {
          return;
        }

        const actualReadModel = await find<GarantiesFinancièresÀDéposerReadModel>(
          actualReadModelKey,
        );

        if (isSome(actualReadModel)) {
          // TODO : erreur à logguer
        }

        if (isNone(actualReadModel)) {
          const région = await getRégionsProjet(event.payload.identifiantProjet);
          await create<GarantiesFinancièresÀDéposerReadModel>(actualReadModelKey, {
            dateLimiteDépôt: event.payload.aggregate.dateLimiteDépôt,
            région,
            identifiantProjet: event.payload.identifiantProjet,
          });
        }
        break;
    }
  };

  mediator.register('GARANTIES_FINANCIÈRES_À_DÉPOSER_PROJECTOR', handler);
};
