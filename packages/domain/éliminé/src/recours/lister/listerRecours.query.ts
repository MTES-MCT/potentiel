import { Message, MessageHandler, mediator } from 'mediateur';
import { RecoursEntity } from '../recours.entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { StatutRecours } from '..';
import { Option, isNone } from '@potentiel/monads';
import { RégionNonTrouvéeError } from '../régionNonTrouvée.error';

type RecoursListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutRecours.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerRecoursReadModel = {
  items: ReadonlyArray<RecoursListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerRecoursPort = (args: {
  where: {
    statut?: StatutRecours.RawType;
    appelOffre?: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
  région?: string;
}) => Promise<{
  items: ReadonlyArray<RecoursEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type ListerRecoursPourPorteurPort = (args: {
  identifiantUtilisateur: string;
  where: {
    statut?: StatutRecours.RawType;
    appelOffre?: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
}) => Promise<{
  items: ReadonlyArray<RecoursEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option<{ région: string }>>;

export type ListerRecoursQuery = Message<
  'LISTER_RECOURS_QUERY',
  {
    utilisateur: {
      rôle: string;
      email: string;
    };
    statut?: StatutRecours.RawType;
    appelOffre?: string;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerRecoursReadModel
>;

export type ListerRecoursDependencies = {
  listerRecoursPourPorteur: ListerRecoursPourPorteurPort;
  listerRecours: ListerRecoursPort;
  récupérerRégionDrealAdapter: RécupérerRégionDrealPort;
};

export const registerListerRecoursQuery = ({
  listerRecoursPourPorteur,
  listerRecours,
  récupérerRégionDrealAdapter,
}: ListerRecoursDependencies) => {
  const handler: MessageHandler<ListerRecoursQuery> = async ({
    statut,
    appelOffre,
    utilisateur: { email, rôle },
    pagination: { page, itemsPerPage },
  }) => {
    const where = {
      ...(statut && { statut }),
      ...(appelOffre && { appelOffre }),
    };

    if (['admin', 'dgec-validateur', 'cre'].includes(rôle)) {
      const recours = await listerRecours({
        where,
        pagination: {
          page,
          itemsPerPage,
        },
      });
      return {
        ...recours,
        items: recours.items.map((recours) => mapToReadModel(recours)),
      };
    }

    if (rôle === 'dreal') {
      const région = await récupérerRégionDrealAdapter(email);
      if (isNone(région)) {
        throw new RégionNonTrouvéeError();
      }

      const recours = await listerRecours({
        where,
        pagination: {
          page,
          itemsPerPage,
        },
        région: région.région,
      });
      return {
        ...recours,
        items: recours.items.map((recours) => mapToReadModel(recours)),
      };
    }

    const recours = await listerRecoursPourPorteur({
      identifiantUtilisateur: email,
      where,
      pagination: { itemsPerPage, page },
    });
    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('LISTER_RECOURS_QUERY', handler);
};

const mapToReadModel = (projection: RecoursEntity): RecoursListItemReadModel => {
  return {
    ...projection,
    statut: StatutRecours.convertirEnValueType(projection.statut),
    misÀJourLe: DateTime.convertirEnValueType(projection.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(projection.identifiantProjet),
  };
};
