import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Where, List, RangeOptions, Joined, LeftJoin } from '@potentiel-domain/entity';

import { GarantiesFinancièresEnAttenteEntity, MotifDemandeGarantiesFinancières } from '../..';
import { LauréatEntity } from '../../../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { StatutLauréat } from '../../..';
import { AbandonEntity } from '../../../abandon';
import { AttestationConformitéEntity } from '../../../achèvement/attestationConformité';

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
    appelOffre?: string;
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
    } = await list<
      GarantiesFinancièresEnAttenteEntity,
      [LauréatEntity, LeftJoin<AbandonEntity>, LeftJoin<AttestationConformitéEntity>]
    >('projet-avec-garanties-financieres-en-attente', {
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
            appelOffre: appelOffre
              ? Where.equal(appelOffre)
              : cycle
                ? cycle === 'PPE2'
                  ? Where.contain('PPE2')
                  : Where.notContains('PPE2')
                : undefined,
            localité: { région: scope.type === 'region' ? Where.equal(scope.region) : undefined },
          },
        },
        {
          entity: 'abandon',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'abandonné'
              ? { statut: Where.equal('accordé') }
              : statut === 'actif'
                ? { statut: Where.notEqual('accordé') }
                : undefined,
        },
        {
          entity: 'attestation-conformité',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'achevé'
              ? { identifiantProjet: Where.notEqualNull() }
              : statut === 'actif'
                ? { identifiantProjet: Where.equalNull() }
                : undefined,
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

const mapToReadModel = ({
  lauréat: { nomProjet },
  identifiantProjet,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
  abandon,
  'attestation-conformité': attestationConformité,
}: GarantiesFinancièresEnAttenteEntity &
  Joined<
    [LauréatEntity, LeftJoin<AbandonEntity>, LeftJoin<AttestationConformitéEntity>]
  >): GarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  statut:
    abandon?.statut === 'accordé'
      ? StatutLauréat.abandonné
      : attestationConformité
        ? StatutLauréat.achevé
        : StatutLauréat.actif,
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
