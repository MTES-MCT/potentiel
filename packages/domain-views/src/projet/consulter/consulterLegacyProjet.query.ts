import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { LegacyProjetReadModel, LegacyProjetReadModelKey } from '../projet.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel/core-domain-views';
import { Option, isSome, none } from '@potentiel/monads';
import { RécupérerDétailProjetPort } from '../projet.ports';

/**
 * @deprecated
 */
export type ConsulterLegacyProjetQuery = Message<
  'CONSULTER_LEGACY_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<LegacyProjetReadModel>
>;

export type ConsulterLegacyProjetDependencies = {
  find: Find;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerConsulterLegacyProjetQuery = ({
  find,
  récupérerDétailProjet,
}: ConsulterLegacyProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterLegacyProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const detailProjet = await récupérerDétailProjet(identifiantProjetValueType);

    if (isSome(detailProjet)) {
      const key: LegacyProjetReadModelKey = `projet|${identifiantProjetValueType.formatter()}`;
      const result = await find<Pick<LegacyProjetReadModel, 'type' | 'identifiantGestionnaire'>>(
        key,
      );

      return {
        type: 'projet',
        ...detailProjet,
        identifiantGestionnaire: isSome(result) ? result.identifiantGestionnaire : undefined,
      };
    }

    return none;
  };

  mediator.register('CONSULTER_LEGACY_PROJET', queryHandler);
};
