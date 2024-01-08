import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonProjection } from '../abandon.projection';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { StatutAbandon } from '..';
import { Option, isNone } from '@potentiel/monads';
import { RégionNonTrouvéeError } from '../régionNonTrouvée.error';

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  recandidature: boolean;
  misÀJourLe: DateTime.ValueType;
};

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerAbandonsPort = (
  filters: {
    recandidature?: boolean;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
  },
  pagination: {
    page: number;
    itemsPerPage: number;
  },
  région?: string,
) => Promise<{
  items: ReadonlyArray<AbandonProjection>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type ListerAbandonsPourPorteurPort = (
  identifiantUtilisateur: string,
  filters: {
    recandidature?: boolean;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
  },
  pagination: {
    page: number;
    itemsPerPage: number;
  },
) => Promise<{
  items: ReadonlyArray<AbandonProjection>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option<{ région: string }>>;

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    utilisateur: {
      rôle: string;
      email: string;
    };
    recandidature?: boolean;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  listerAbandonsPourPorteur: ListerAbandonsPourPorteurPort;
  listerAbandons: ListerAbandonsPort;
  récupérerRégionDrealAdapter: RécupérerRégionDrealPort;
};

export const registerListerAbandonQuery = ({
  listerAbandonsPourPorteur,
  listerAbandons,
  récupérerRégionDrealAdapter,
}: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    statut,
    appelOffre,
    utilisateur: { email, rôle },
    pagination: { page, itemsPerPage },
  }) => {
    const filters = {
      ...(recandidature !== undefined && { demandeRecandidature: recandidature }),
      ...(statut && { statut }),
      ...(appelOffre && { appelOffre }),
    };

    if (['admin', 'dgec-validateur'].includes(rôle)) {
      const abandons = await listerAbandons(filters, {
        page,
        itemsPerPage,
      });
      return {
        ...abandons,
        items: abandons.items.map((abandon) => mapToReadModel(abandon)),
      };
    }

    if (rôle === 'dreal') {
      const région = await récupérerRégionDrealAdapter(email);
      if (isNone(région)) {
        throw new RégionNonTrouvéeError();
      }

      const abandons = await listerAbandons(
        filters,
        {
          page,
          itemsPerPage,
        },
        région.région,
      );
      return {
        ...abandons,
        items: abandons.items.map((abandon) => mapToReadModel(abandon)),
      };
    }

    const abandons = await listerAbandonsPourPorteur(email, filters, {
      page,
      itemsPerPage,
    });
    return {
      ...abandons,
      items: abandons.items.map((abandon) => mapToReadModel(abandon)),
    };
  };

  mediator.register('LISTER_ABANDONS_QUERY', handler);
};

const mapToReadModel = (projection: AbandonProjection): AbandonListItemReadModel => {
  return {
    ...projection,
    statut: StatutAbandon.convertirEnValueType(projection.statut),
    recandidature: projection.demandeRecandidature,
    misÀJourLe: DateTime.convertirEnValueType(projection.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(projection.identifiantProjet),
  };
};
