import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/entity';
import { Role } from '@potentiel-domain/utilisateur';

import {
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
import { MainlevéeGarantiesFinancièresEntity } from '../mainlevéeGarantiesFinancières.entity';
import {
  ConsulterDemandeMainlevéeGarantiesFinancièresReadModel,
  consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel,
} from '../consulter/consulterDemandeMainlevéeGarantiesFinancières.query';

export type ListerDemandeMainlevéeItemReadModel =
  ConsulterDemandeMainlevéeGarantiesFinancièresReadModel;

export type ListerDemandeMainlevéeReadModel = Readonly<{
  items: ReadonlyArray<ListerDemandeMainlevéeItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerDemandeMainlevéeQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    utilisateur: {
      rôle: string;
      régionDreal?: string;
    };
  },
  ListerDemandeMainlevéeReadModel
>;

type ListerDemandeMainlevéeQueryDependencies = {
  list: List;
};

const mapToWhereEqual = <T>(value: T | undefined) =>
  value !== undefined
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;

export const registerListerDemandeMainlevéeQuery = ({
  list,
}: ListerDemandeMainlevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainlevéeQuery> = async ({
    range,
    appelOffre,
    motif,
    statut,
    utilisateur: { régionDreal, rôle },
  }) => {
    const région = Role.convertirEnValueType(rôle).estÉgaleÀ(Role.dreal)
      ? régionDreal ?? 'non-trouvée'
      : undefined;

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<MainlevéeGarantiesFinancièresEntity>('mainlevee-garanties-financieres', {
      orderBy: {
        demande: {
          demandéeLe: 'ascending',
        },
      },
      range,
      where: {
        appelOffre: mapToWhereEqual(appelOffre),
        motif: mapToWhereEqual(motif),
        statut: statut
          ? { operator: 'equal', value: statut }
          : { operator: 'include', value: ['en-instruction', 'demandé', 'accepté'] },
        régionProjet: mapToWhereEqual(région),
      },
    });

    return {
      items: items.map(consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Lister', handler);
};
