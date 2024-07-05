import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { CommonError, CommonPort } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import {
  GarantiesFinancièresEntity,
  MainlevéeAccordée,
  MainlevéeDemandée,
  MainlevéeEnInstruction,
  MainlevéeRejetée,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
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
    statut?: Array<StatutMainlevéeGarantiesFinancières.RawType>;
    utilisateur: {
      rôle: string;
      email: string;
    };
  },
  ListerDemandeMainlevéeReadModel
>;

type ListerDemandeMainlevéeQueryDependencies = {
  list: List;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDemandeMainlevéeQuery = ({
  list,
  récupérerRégionDreal,
}: ListerDemandeMainlevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainlevéeQuery> = async ({
    range,
    appelOffre,
    motif,
    statut = ['accordé', 'demandé', 'en-instruction', 'rejeté'],
    utilisateur,
  }) => {
    let région: string | undefined = undefined;

    if (utilisateur.rôle === Role.dreal.nom) {
      const régionDreal = await récupérerRégionDreal(utilisateur.email);

      if (Option.isNone(régionDreal)) {
        throw new CommonError.RégionNonTrouvéeError();
      }

      région = régionDreal.région;
    }

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<GarantiesFinancièresEntity>('garanties-financieres', {
      orderBy: {
        mainlevée: {
          demande: {
            demandéLe: 'ascending',
          },
        },
      },
      range,
      where: {
        typeGF: {
          operator: 'include',
          value: ['avec-date-échéance', 'consignation'],
        },
        projet: {
          appelOffre: mapToWhereEqual(appelOffre),
          régionProjet: mapToWhereEqual(région),
        },
        mainlevée: {
          motif: mapToWhereEqual(motif),
          statut: {
            operator: 'include' as const,
            //@ts-expect-error Il n'y a pas d'erreur au runtime mais nous avons un bug de typage avec les WhereCondtion
            value: statut,
          },
        },
      },
    });

    return {
      items: items.map((item) => {
        return consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel(
          item.identifiantProjet,
          item.projet,
          item.mainlevée as
            | MainlevéeDemandée
            | MainlevéeEnInstruction
            | MainlevéeAccordée
            | MainlevéeRejetée,
        );
      }),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Lister', handler);
};

const mapToWhereEqual = <T>(value: T | undefined) =>
  value
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;
