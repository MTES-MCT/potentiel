import { ListV2, RangeOptions } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { CommonError, CommonPort, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import {
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
import {
  ConsulterMainlevéeGarantiesFinancièresReadModel,
  consulterMainlevéeGarantiesFinancièresMapToReadModel,
} from '../consulter/consulterMainlevéeGarantiesFinancières.query';
import { MainlevéeGarantiesFinancièresEntity } from '../mainlevéeGarantiesFinancières.entity';

export type ListerDemandeMainlevéeItemReadModel = ConsulterMainlevéeGarantiesFinancièresReadModel;

export type ListerDemandeMainlevéeReadModel = Readonly<{
  items: ReadonlyArray<ListerDemandeMainlevéeItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerDemandeMainlevéeQuery = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    utilisateur: {
      rôle: string;
      email: string;
    };
  },
  ListerDemandeMainlevéeReadModel
>;

type ListerDemandeMainlevéeQueryDependencies = {
  listV2: ListV2;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDemandeMainlevéeQuery = ({
  listV2: list,
  récupérerRégionDreal,
}: ListerDemandeMainlevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainlevéeQuery> = async ({
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
    } = await list<MainlevéeGarantiesFinancièresEntity>('mainlevee-garanties-financieres', {
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
      items: items.map((item) =>
        consulterMainlevéeGarantiesFinancièresMapToReadModel({
          ...item,
          identifiantProjetValueType: IdentifiantProjet.convertirEnValueType(
            item.identifiantProjet,
          ),
        }),
      ),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Query.Lister', handler);
};
