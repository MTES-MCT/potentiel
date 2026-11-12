import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime } from '@potentiel-domain/common';
import { Email } from '@potentiel-domain/common';
import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import type { GetScopeProjetUtilisateur } from '../../../index.js';
import {
  type DonnéesProjetPourAchèvementJoins,
  type DonnéesProjetPourAchèvementReadModel,
  getDonnéesProjetPourAchèvementJoin,
  listerDonnéesRaccordement,
  mapToDonnéesProjetPourAchèvementReadModel,
} from '../_helpers/donnéesProjetPourAchèvement.js';
import type { AchèvementEntity } from '../achèvement.entity.js';

export type ListerProjetsEnAttenteDAchèvementReadModel = {
  items: Array<DonnéesProjetPourAchèvementReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetsEnAttenteDAchèvementQuery = Message<
  'Lauréat.Achèvement.Query.ListerProjetsEnAttenteDAchèvement',
  {
    appelOffre?: Array<string>;
    periode?: string;
    depuis?: DateTime.RawType;
    range?: RangeOptions;
    identifiantUtilisateur: Email.RawType;
  },
  ListerProjetsEnAttenteDAchèvementReadModel
>;

export type ListerProjetsEnAttenteDAchèvementDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerProjetsEnAttenteDAchèvementQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerProjetsEnAttenteDAchèvementDependencies) => {
  const handler: MessageHandler<ListerProjetsEnAttenteDAchèvementQuery> = async ({
    appelOffre,
    periode,
    depuis,
    range,
    identifiantUtilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );

    const {
      items: projets,
      range: { endPosition, startPosition },
      total: totalProjet,
    } = await list<AchèvementEntity, DonnéesProjetPourAchèvementJoins>('achèvement', {
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        estAchevé: Where.equal(false),
        initiation: {
          initiéLe: depuis ? Where.greaterOrEqual(depuis) : Where.notEqualNull(),
        },
      },
      join: getDonnéesProjetPourAchèvementJoin({
        whereLauréat: {
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          période: Where.equal(periode),
          localité: {
            région: Where.matchAny(scope.régions),
          },
        },
      }),
      orderBy: {
        identifiantProjet: 'ascending',
      },
      range,
    });

    if (totalProjet === 0) {
      return { items: [], range: { endPosition: 0, startPosition: 0 }, total: 0 };
    }

    const { dossiers, gestionnaires } = await listerDonnéesRaccordement({ list, projets });

    return {
      items: projets.map((projet) =>
        mapToDonnéesProjetPourAchèvementReadModel({ projet, dossiers, gestionnaires }),
      ),
      range: { endPosition, startPosition },
      total: totalProjet,
    };
  };

  mediator.register('Lauréat.Achèvement.Query.ListerProjetsEnAttenteDAchèvement', handler);
};
