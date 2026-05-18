import { type Message, type MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { type Joined, type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import type { CandidatureEntity } from '../../candidature/index.js';
import { type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import type { AccèsEntity } from '../accès.entity.js';

type AccèsListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateursAyantAccès: Array<Email.ValueType>;
};

export type ListerAccèsReadModel = {
  items: Array<AccèsListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerAccèsQuery = Message<
  'Projet.Accès.Query.ListerAccès',
  {
    identifiantUtilisateur: Email.RawType;
    range?: RangeOptions;
  },
  ListerAccèsReadModel
>;

export type ListerAccèsDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerAccèsQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerAccèsDependencies) => {
  const handler: MessageHandler<ListerAccèsQuery> = async ({ identifiantUtilisateur, range }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );

    const accès = await list<AccèsEntity, CandidatureEntity>('accès', {
      range,
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets ?? []),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
        where: {
          localité: {
            région: Where.matchAny(scope.régions),
          },
        },
      },
    });

    return {
      ...accès,
      items: accès.items.map((accès) => mapToReadModel(accès)),
    };
  };

  mediator.register('Projet.Accès.Query.ListerAccès', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  utilisateursAyantAccès,
}: AccèsEntity & Joined<CandidatureEntity>): AccèsListItemReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    utilisateursAyantAccès: utilisateursAyantAccès.map((identifiantUtilisateur) =>
      Email.convertirEnValueType(identifiantUtilisateur),
    ),
  };
};
