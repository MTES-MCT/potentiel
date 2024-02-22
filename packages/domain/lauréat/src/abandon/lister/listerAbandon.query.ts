import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonEntity } from '../abandon.entity';
import {
  DateTime,
  IdentifiantProjet,
  RécupérerRégionDrealPort,
  RégionNonTrouvéeError,
} from '@potentiel-domain/common';
import { StatutAbandon, StatutPreuveRecandidature } from '..';
import { isNone } from '@potentiel/monads';

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  recandidature: boolean;
  preuveRecandidatureStatut: StatutPreuveRecandidature.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerAbandonsPort = (args: {
  where: {
    recandidature?: boolean;
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
  région?: string;
}) => Promise<{
  items: ReadonlyArray<AbandonEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type ListerAbandonsPourPorteurPort = (args: {
  identifiantUtilisateur: string;
  where: {
    recandidature?: boolean;
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
}) => Promise<{
  items: ReadonlyArray<AbandonEntity>;
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
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  listerAbandonsPourPorteur: ListerAbandonsPourPorteurPort;
  listerAbandons: ListerAbandonsPort;
  récupérerRégionDreal: RécupérerRégionDrealPort;
};

export const registerListerAbandonQuery = ({
  listerAbandonsPourPorteur,
  listerAbandons,
  récupérerRégionDreal,
}: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    statut,
    appelOffre,
    preuveRecandidatureStatut,
    utilisateur: { email, rôle },
    pagination: { page, itemsPerPage },
  }) => {
    const where = {
      ...(recandidature !== undefined && { demandeRecandidature: recandidature }),
      ...(statut && { statut }),
      ...(appelOffre && { appelOffre }),
      ...(preuveRecandidatureStatut && {
        preuveRecandidatureStatut,
      }),
    };

    if (['admin', 'dgec-validateur', 'cre'].includes(rôle)) {
      const abandons = await listerAbandons({
        where,
        pagination: {
          page,
          itemsPerPage,
        },
      });
      return {
        ...abandons,
        items: abandons.items.map((abandon) => mapToReadModel(abandon)),
      };
    }

    if (rôle === 'dreal') {
      const région = await récupérerRégionDreal(email);
      if (isNone(région)) {
        throw new RégionNonTrouvéeError();
      }

      const abandons = await listerAbandons({
        where,
        pagination: {
          page,
          itemsPerPage,
        },
        région: région.région,
      });
      return {
        ...abandons,
        items: abandons.items.map((abandon) => mapToReadModel(abandon)),
      };
    }

    const abandons = await listerAbandonsPourPorteur({
      identifiantUtilisateur: email,
      where,
      pagination: { itemsPerPage, page },
    });
    return {
      ...abandons,
      items: abandons.items.map((abandon) => mapToReadModel(abandon)),
    };
  };

  mediator.register('LISTER_ABANDONS_QUERY', handler);
};

const mapToReadModel = (projection: AbandonEntity): AbandonListItemReadModel => {
  return {
    ...projection,
    statut: StatutAbandon.convertirEnValueType(projection.statut),
    recandidature: projection.demandeRecandidature,
    misÀJourLe: DateTime.convertirEnValueType(projection.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(projection.identifiantProjet),
    preuveRecandidatureStatut: StatutPreuveRecandidature.convertirEnValueType(
      projection.preuveRecandidatureStatut,
    ),
  };
};
