import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { CommonError, CommonPort } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import {
  MotifDemandeMainlevéeGarantiesFinancières,
  // StatutMainlevéeGarantiesFinancières,
} from '../..';
import { MainlevéeGarantiesFinancièresEntity } from '../mainlevéeGarantiesFinancières.entity';
import {
  ConsulterDemandeMainlevéeGarantiesFinancièresReadModel,
  consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel,
} from '../consulter/consulterDemandeMainlevéeGarantiesFinancières.query';

type Status = 'demandé' | 'en-instruction' | 'accordé' | 'rejeté';

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
    statut: Array<Status>;
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

const mapToWhereEqual = <T>(value: T | undefined) =>
  value
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;

export const registerListerDemandeMainlevéeQuery = ({
  list,
  récupérerRégionDreal,
}: ListerDemandeMainlevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainlevéeQuery> = async ({
    range,
    appelOffre,
    motif,
    // statut,
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
    } = await list<MainlevéeGarantiesFinancièresEntity>('mainlevee-garanties-financieres', {
      orderBy: {
        demandéLe: 'ascending',
      },
      range,
      where: {
        appelOffre: mapToWhereEqual(appelOffre),
        motif: mapToWhereEqual(motif),
        régionProjet: mapToWhereEqual(région),
        // statut: {
        //   type: {
        //     operator: 'include',
        //     value: statut as Array<Status>,
        //   },
        // },
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
