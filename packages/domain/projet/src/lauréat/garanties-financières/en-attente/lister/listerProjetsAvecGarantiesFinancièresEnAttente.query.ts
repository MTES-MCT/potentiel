import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Where, List, RangeOptions, Joined } from '@potentiel-domain/entity';

import { GarantiesFinancièresEnAttenteEntity, MotifDemandeGarantiesFinancières } from '../..';
import { LauréatEntity } from '../../../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { StatutLauréat } from '../../..';

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
    motif?: string;
    cycle?: string;
    statut?: StatutLauréat.RawType;
    identifiantUtilisateur: string;
    range?: RangeOptions;
  },
  ListerGarantiesFinancièresEnAttenteReadModel
>;

export type ListerGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
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
    } = await list<GarantiesFinancièresEnAttenteEntity, [LauréatEntity]>(
      'projet-avec-garanties-financieres-en-attente',
      {
        orderBy: { dernièreMiseÀJour: { date: 'descending' } },
        range,
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          motif: Where.equal(motif),
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
                région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
              },
              statut: Where.equal(statut),
            },
          },
        ],
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
  lauréat: { nomProjet, statut },
  identifiantProjet,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
}: GarantiesFinancièresEnAttenteEntity &
  Joined<[LauréatEntity]>): GarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  statut: StatutLauréat.convertirEnValueType(statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
