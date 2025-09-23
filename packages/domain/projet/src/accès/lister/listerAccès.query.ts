import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { GetProjetUtilisateurScope } from '../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet } from '../..';
import { AccèsEntity } from '../accès.entity';
import { CandidatureEntity } from '../../candidature';

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
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
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
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : Where.matchAny([]),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
        where: {
          localité: {
            région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
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
