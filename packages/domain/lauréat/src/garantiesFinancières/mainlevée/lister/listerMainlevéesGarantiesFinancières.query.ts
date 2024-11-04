import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, RangeOptions } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
import {
  ConsulterDemandeMainlevéeGarantiesFinancièresReadModel,
  consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel,
} from '../consulter/consulterDemandeMainlevéeGarantiesFinancières.query';
import { getRoleBasedWhereCondition, Utilisateur } from '../../utils/getRoleBasedWhereCondition';

export type ListerMainlevéeItemReadModel = ConsulterDemandeMainlevéeGarantiesFinancièresReadModel;

export type ListerMainlevéesReadModel = Readonly<{
  items: ReadonlyArray<ListerMainlevéeItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerMainlevéesQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    utilisateur: Utilisateur;
  },
  ListerMainlevéesReadModel
>;

type ListerMainlevéesQueryDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerMainlevéesQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerMainlevéesQueryDependencies) => {
  const handler: MessageHandler<ListerMainlevéesQuery> = async ({
    range,
    appelOffre,
    motif,
    statut,
    utilisateur,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<MainlevéeGarantiesFinancièresEntity>('mainlevee-garanties-financieres', {
      // violette
      // à voir pour le orderBy
      // orderBy: {
      //   demande: {
      //     demandéeLe: 'ascending',
      //   },
      // },
      range,
      where: {
        ...(appelOffre && { appelOffre: Where.include([appelOffre]) }),
        ...(motif && { motif: Where.include([motif]) }),
        ...(statut && { statut: Where.include([statut]) }),
        ...(await getRoleBasedWhereCondition(
          utilisateur,
          récupérerIdentifiantsProjetParEmailPorteur,
        )),
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
