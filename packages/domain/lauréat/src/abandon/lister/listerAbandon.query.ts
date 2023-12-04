import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { StatutAbandon } from '..';

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

export type ListerIdentifiantsProjetsParPorteurPort = (email: string) => Promise<
  Array<{
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
  }>
>;

export type ListerAbandonsParProjetsPort = (
  identifiantsProjets: Array<string>,
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
  list: List;
  listerIdentifiantsProjetsParPorteurPort: ListerIdentifiantsProjetsParPorteurPort;
  listerAbandonsParProjetsPort: ListerAbandonsParProjetsPort;
};

export const registerListerAbandonQuery = ({
  list,
  listerIdentifiantsProjetsParPorteurPort,
  listerAbandonsParProjetsPort,
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

    if (rôle === 'porteur-projet') {
      const identifiantsProjets = await listerIdentifiantsProjetsParPorteurPort(email);
      const abandons = await listerAbandonsParProjetsPort(
        identifiantsProjets.map(
          ({ appelOffre, période, famille = '', numéroCRE }) =>
            `${appelOffre}#${période}#${famille}#${numéroCRE}`,
        ),
        filters,
        {
          page,
          itemsPerPage,
        },
      );
      return {
        ...abandons,
        items: abandons.items.map((abandon) => mapToReadModel(abandon)),
      };
    }

    const result = await list<AbandonProjection>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where: filters,
      orderBy: {
        property: 'misÀJourLe',
        ascending: false,
      },
    });

    return {
      ...result,
      items: result.items.map((item) => mapToReadModel(item)),
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
