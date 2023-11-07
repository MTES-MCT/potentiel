import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';
import { IdentifiantProjet } from '@potentiel-domain/common';

type AbandonListItem = {
  identifiantProjet: IdentifiantProjet.RawType;
  nomProjet: string;
  statut: string;
  demandeRaison: string;
  demandePièceJustificativeFormat?: string;
  demandeRecandidature: boolean;
  demandeDemandéPar: string;
  demandeDemandéLe: string;
  accordRéponseSignéeFormat?: string;
  accordAccordéPar?: string;
  accordAccordéLe?: string;
  rejetRéponseSignéeFormat?: string;
  rejetRejetéPar?: string;
  rejetRejetéLe?: string;
  confirmationDemandéePar?: string;
  confirmationDemandéeLe?: string;
  confirmationDemandéeRéponseSignéeFormat?: string;
  confirmationConfirméLe?: string;
  confirmationConfirméPar?: string;
};

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonListItem>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    recandidature?: boolean;
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
    pagination: { page, itemsPerPage },
  }) => {
    const result = await list<AbandonProjection>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where:
        recandidature !== undefined
          ? {
              demandeRecandidature: recandidature,
            }
          : undefined,
      orderBy: {
        property: 'demandeDemandéLe',
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

const mapToReadModel = (projection: AbandonProjection): AbandonListItem => {
  return {
    ...projection,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      projection.identifiantProjet,
    ).formatter(),
  };
};
