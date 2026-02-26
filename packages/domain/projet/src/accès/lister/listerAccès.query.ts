import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import { AccèsEntity } from '../accès.entity.js';
import { CandidatureEntity } from '../../candidature/index.js';

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
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
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
