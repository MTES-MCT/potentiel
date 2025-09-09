import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { Where, List, RangeOptions, Joined } from '@potentiel-domain/entity';

import { GarantiesFinancièresEnAttenteEntity, MotifDemandeGarantiesFinancières } from '../..';
import { LauréatEntity } from '../../../lauréat.entity';
import { IdentifiantProjet } from '../../../..';
import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_helpers/getRoleBasedWhereCondition';

type GarantiesFinancièresEnAttenteListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
  };
};

export type ListerGarantiesFinancièresEnAttenteReadModel = {
  items: ReadonlyArray<GarantiesFinancièresEnAttenteListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
  {
    appelOffre?: string;
    motif?: string;
    cycle?: string;
    utilisateur: Utilisateur;
    range?: RangeOptions;
  },
  ListerGarantiesFinancièresEnAttenteReadModel
>;

export type ListerGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerGarantiesFinancièresEnAttenteQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ListerGarantiesFinancièresEnAttenteQuery> = async ({
    appelOffre,
    motif,
    utilisateur,
    range,
    cycle,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<GarantiesFinancièresEnAttenteEntity, LauréatEntity>(
      'projet-avec-garanties-financieres-en-attente',
      {
        orderBy: { dernièreMiseÀJour: { date: 'descending' } },
        range,
        where: {
          identifiantProjet,
          motif: Where.equal(motif),
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre
              ? Where.equal(appelOffre)
              : cycle
                ? cycle === 'PPE2'
                  ? Where.contain('PPE2')
                  : Where.notContains('PPE2')
                : undefined,
            localité: {
              région: régionProjet,
            },
          },
        },
      },
    );

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

const mapToReadModel = ({
  lauréat: { nomProjet },
  identifiantProjet,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
}: GarantiesFinancièresEnAttenteEntity &
  Joined<LauréatEntity>): GarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
