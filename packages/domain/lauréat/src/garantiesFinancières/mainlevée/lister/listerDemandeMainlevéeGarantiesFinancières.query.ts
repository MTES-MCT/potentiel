import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, RangeOptions, WhereOptions } from '@potentiel-domain/entity';
import { Role, RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

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

type Utilisateur = {
  rôle: string;
  régionDreal?: string;
  identifiantUtilisateur: string;
};

export type ListerDemandeMainlevéeQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    utilisateur: Utilisateur;
  },
  ListerDemandeMainlevéeReadModel
>;

type ListerDemandeMainlevéeQueryDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerDemandeMainlevéeQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerDemandeMainlevéeQueryDependencies) => {
  const handler: MessageHandler<ListerDemandeMainlevéeQuery> = async ({
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
      orderBy: {
        demande: {
          demandéeLe: 'ascending',
        },
      },
      range,
      where: {
        appelOffre: Where.equal(appelOffre),
        motif: Where.equal(motif),
        statut: statut
          ? Where.equal(statut)
          : Where.include(['en-instruction', 'demandé', 'accepté']),
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

const getRoleBasedWhereCondition = async (
  utilisateur: Utilisateur,
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur,
): Promise<WhereOptions<MainlevéeGarantiesFinancièresEntity>> => {
  const rôleValueType = Role.convertirEnValueType(utilisateur.rôle);
  if (rôleValueType.estÉgaleÀ(Role.porteur)) {
    const identifiantProjets = await récupérerIdentifiantsProjetParEmailPorteur(
      utilisateur.identifiantUtilisateur,
    );

    return { identifiantProjet: Where.include(identifiantProjets) };
  }
  if (rôleValueType.estÉgaleÀ(Role.dreal)) {
    return { régionProjet: Where.equal(utilisateur.régionDreal ?? 'non-trouvée') };
  }

  return {};
};
