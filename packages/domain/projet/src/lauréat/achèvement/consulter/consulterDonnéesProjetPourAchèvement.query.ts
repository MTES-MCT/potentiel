import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Find, List } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../../index.js';
import {
  type DonnéesProjetPourAchèvementJoins,
  type DonnéesProjetPourAchèvementReadModel,
  getDonnéesProjetPourAchèvementJoin,
  listerDonnéesRaccordement,
  mapToDonnéesProjetPourAchèvementReadModel,
} from '../_helpers/donnéesProjetPourAchèvement.js';
import type { AchèvementEntity } from '../achèvement.entity.js';

export type ConsulterDonnéesProjetPourAchèvementQuery = Message<
  'Lauréat.Achèvement.Query.ConsulterDonnéesProjetPourAchèvement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<DonnéesProjetPourAchèvementReadModel>
>;

export type ConsulterDonnéesProjetPourAchèvementDependencies = {
  find: Find;
  list: List;
};

export const registerConsulterDonnéesProjetPourAchèvementQuery = ({
  find,
  list,
}: ConsulterDonnéesProjetPourAchèvementDependencies) => {
  const handler: MessageHandler<ConsulterDonnéesProjetPourAchèvementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const projet = await find<AchèvementEntity, DonnéesProjetPourAchèvementJoins>(
      `achèvement|${identifiantProjet.formatter()}`,
      { join: getDonnéesProjetPourAchèvementJoin() },
    );

    if (Option.isNone(projet)) {
      return Option.none;
    }

    const { dossiers, gestionnaires } = await listerDonnéesRaccordement({
      list,
      projets: [projet],
    });

    return mapToDonnéesProjetPourAchèvementReadModel({ projet, dossiers, gestionnaires });
  };

  mediator.register('Lauréat.Achèvement.Query.ConsulterDonnéesProjetPourAchèvement', handler);
};
