import { ListV2, RangeOptions } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import {
  ConsulterMainLevéeGarantiesFinancièresReadModel,
  consulterMainLevéeGarantiesFinancièresMapToReadModel,
} from '../consulter/consulterMainLevéeGarantiesFinancières.query';
import {
  MainLevéeGarantiesFinancièresEntity,
  MotifDemandeMainLevéeGarantiesFinancières,
  StatutMainLevéeGarantiesFinancières,
} from '../..';
import { Role } from '@potentiel-domain/utilisateur';
import { CommonError, CommonPort } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

export type ListerDemandeMainLevéeItemReadModel = ConsulterMainLevéeGarantiesFinancièresReadModel;

export type ListerDemandeMainLevéeReadModel = Readonly<{
  items: ReadonlyArray<ListerDemandeMainLevéeItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerDemandeMainLevéeQuery = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainLevéeGarantiesFinancières.RawType;
    statut?: StatutMainLevéeGarantiesFinancières.RawType;
    utilisateur: {
      rôle: string;
      email: string;
    };
  },
  ListerDemandeMainLevéeReadModel
>;

export type ListerDemandeMainLevéeQueryDependencies = {
  listV2: ListV2;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDemandeMainLevéeQuery = ({
  listV2: list,
  récupérerRégionDreal,
}: ListerDemandeMainLevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainLevéeQuery> = async ({
    range,
    appelOffre,
    motif,
    statut,
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
    } = await list<MainLevéeGarantiesFinancièresEntity>('main-levee-garanties-financieres', {
      orderBy: {
        demande: {
          demandéeLe: 'ascending',
        },
      },
      range,
      where: {
        ...(appelOffre && {
          appelOffre: { operator: 'equal', value: appelOffre },
        }),
        ...(motif && {
          motif: { operator: 'equal', value: motif },
        }),
        statut: statut
          ? { operator: 'equal', value: statut }
          : { operator: 'include', value: ['en-instruction', 'demandé', 'accepté'] },
        ...(région && {
          régionProjet: { operator: 'equal', value: région },
        }),
      },
    });

    return {
      items: items.map(consulterMainLevéeGarantiesFinancièresMapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Query.Lister', handler);
};
