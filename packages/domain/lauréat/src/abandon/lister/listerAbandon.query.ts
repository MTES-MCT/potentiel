import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { StatutAbandon } from '..';
import { RawType } from '../statutAbandon.valueType';

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
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

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    recandidature?: boolean;
    statut?: RawType;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  list: List;
};

export const registerListerAbandonQuery = ({ list }: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    statut,
    pagination: { page, itemsPerPage },
  }) => {
    const result = await list<AbandonProjection>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where:
        statut || recandidature !== undefined
          ? {
              ...(recandidature !== undefined && { demandeRecandidature: recandidature }),
              ...(statut && { statut }),
            }
          : undefined,
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
