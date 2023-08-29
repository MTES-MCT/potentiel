import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { ProjetReadModel, ProjetReadModelKey } from '../projet.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel/core-domain';
import { Option, isSome, none } from '@potentiel/monads';
import { RécupérerDétailProjetPort } from '../projet.ports';

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<ProjetReadModel>
>;

export type ConsulterProjetDependencies = {
  find: Find;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerConsulterProjetQuery = ({
  find,
  récupérerDétailProjet,
}: ConsulterProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const detailProjet = await récupérerDétailProjet(identifiantProjetValueType);

    if (isSome(detailProjet)) {
      const key: ProjetReadModelKey = `projet|${identifiantProjetValueType.formatter()}`;
      const result = await find<Pick<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>(key);

      return {
        type: 'projet',
        ...detailProjet,
        identifiantGestionnaire: isSome(result) ? result.identifiantGestionnaire : undefined,
      };
    }

    return none;
  };

  mediator.register('CONSULTER_PROJET', queryHandler);
};
