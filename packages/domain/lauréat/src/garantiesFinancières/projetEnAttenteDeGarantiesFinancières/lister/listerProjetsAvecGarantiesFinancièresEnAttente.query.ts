import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { Where, List, RangeOptions, Joined } from '@potentiel-domain/entity';

import {
  MotifDemandeGarantiesFinancières,
  ProjetAvecGarantiesFinancièresEnAttenteEntity,
} from '../..';
import {
  Utilisateur,
  getRoleBasedWhereCondition,
} from '../../../_utils/getRoleBasedWhereCondition';
import { LauréatEntity } from '../../../lauréat.entity';

type ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
  };
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel = {
  items: ReadonlyArray<ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
  {
    appelOffre?: string;
    motif?: string;
    cycle?: string;
    utilisateur: Utilisateur;
    range?: RangeOptions;
  },
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel
>;

export type ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ListerProjetsAvecGarantiesFinancièresEnAttenteQuery> = async ({
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
    } = await list<ProjetAvecGarantiesFinancièresEnAttenteEntity, LauréatEntity>(
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
    'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
    handler,
  );
};

const mapToReadModel = ({
  lauréat: { nomProjet },
  identifiantProjet,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
}: ProjetAvecGarantiesFinancièresEnAttenteEntity &
  Joined<LauréatEntity>): ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
