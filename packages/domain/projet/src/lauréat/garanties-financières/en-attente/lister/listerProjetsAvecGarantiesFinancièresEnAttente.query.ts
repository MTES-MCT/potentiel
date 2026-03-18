import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Where, List, RangeOptions, Joined, LeftJoin } from '@potentiel-domain/entity';

import {
  DépôtGarantiesFinancièresEntity,
  GarantiesFinancièresEntity,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
} from '../../index.js';
import { LauréatEntity } from '../../../lauréat.entity.js';
import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../../index.js';
import { StatutLauréat } from '../../../index.js';

export type GarantiesFinancièresEnAttenteListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
  };
  statut: StatutLauréat.ValueType;
};

export type ListerGarantiesFinancièresEnAttenteReadModel = {
  items: ReadonlyArray<GarantiesFinancièresEnAttenteListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
  {
    appelOffre?: Array<string>;
    motif?: MotifDemandeGarantiesFinancières.RawType;
    cycle?: string;
    statut?: StatutLauréat.RawType;
    identifiantUtilisateur: string;
    range?: RangeOptions;
  },
  ListerGarantiesFinancièresEnAttenteReadModel
>;

export type ListerGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerGarantiesFinancièresEnAttenteQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ListerGarantiesFinancièresEnAttenteQuery> = async ({
    appelOffre,
    motif,
    identifiantUtilisateur,
    range,
    cycle,
    statut,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<
      GarantiesFinancièresEntity,
      [LauréatEntity, LeftJoin<DépôtGarantiesFinancièresEntity>]
    >('garanties-financieres', {
      orderBy: { dernièreMiseÀJour: { date: 'descending' } },
      range,
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),

        statut: Where.matchAny([
          StatutGarantiesFinancières.nonDéposé.statut,
          StatutGarantiesFinancières.échu.statut,
        ]),
        enAttente: {
          motif: Where.equal(motif) ?? Where.notEqualNull(),
        },
      },
      join: [
        {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre?.length
              ? Where.matchAny(appelOffre)
              : cycle
                ? cycle === 'PPE2'
                  ? Where.like('PPE2')
                  : Where.notLike('PPE2')
                : undefined,
            localité: {
              région: Where.matchAny(scope.régions),
            },
            statut: Where.equal(statut),
          },
        },
        {
          entity: 'depot-en-cours-garanties-financieres',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            dépôt: { type: Where.equalNull() },
          },
        },
      ],
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      range: { endPosition, startPosition },
      total,
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
    handler,
  );
};

type MapToReadModelProps = (
  args: GarantiesFinancièresEntity & Joined<[LauréatEntity]>,
) => GarantiesFinancièresEnAttenteListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  lauréat: { nomProjet, statut },
  identifiantProjet,
  enAttente,
  dernièreMiseÀJour: { date },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(enAttente!.motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(enAttente!.dateLimiteSoumission),
  statut: StatutLauréat.convertirEnValueType(statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
