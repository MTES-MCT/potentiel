import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../../lauréat.entity.js';
import {
  Candidature,
  DocumentProjet,
  GetScopeProjetUtilisateur,
  IdentifiantProjet,
} from '../../../../index.js';
import { DocumentGarantiesFinancières, GarantiesFinancièresEntity } from '../../index.js';

type DépôtGarantiesFinancièresListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    soumisLe: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: Email.ValueType;
    };
  };
};

export type ListerDépôtsGarantiesFinancièresReadModel = {
  items: ReadonlyArray<DépôtGarantiesFinancièresListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDépôtsGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières',
  {
    appelOffre?: Array<string>;
    cycle?: string;
    identifiantUtilisateur: string;
    range?: RangeOptions;
  },
  ListerDépôtsGarantiesFinancièresReadModel
>;

export type ListerDépôtsGarantiesFinancièresDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerDépôtsGarantiesFinancièresQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDépôtsGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsGarantiesFinancièresQuery> = async ({
    appelOffre,
    identifiantUtilisateur,
    range,
    cycle,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );
    const {
      items,
      range: { startPosition, endPosition },
      total,
    } = await list<GarantiesFinancièresEntity, LauréatEntity>('garanties-financieres', {
      orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
      range,
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        dépôt: { soumisLe: Where.notEqualNull() },
      },
      join: {
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
        },
      },
    });

    return {
      items: items.map((item) =>
        mapToReadModel({ ...item, dépôt: item.dépôt as NonNullable<typeof item.dépôt> }),
      ),
      range: { endPosition, startPosition },
      total,
    };
  };

  mediator.register('Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières', handler);
};

type MapToReadModel = (
  garantiesFinancièresEntity: Joined<LauréatEntity> &
    GarantiesFinancièresEntity & {
      dépôt: NonNullable<GarantiesFinancièresEntity['dépôt']>;
    },
) => DépôtGarantiesFinancièresListItemReadModel;

const mapToReadModel: MapToReadModel = ({ lauréat, dépôt, identifiantProjet }) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet: lauréat.nomProjet,
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(dépôt.type),
    dateÉchéance:
      dépôt.type === 'avec-date-échéance'
        ? DateTime.convertirEnValueType(dépôt.dateÉchéance)
        : undefined,
    dateConstitution: DateTime.convertirEnValueType(dépôt.constitution.date),
    attestation: DocumentGarantiesFinancières.attestationSoumise({
      identifiantProjet,
      dateConstitution: dépôt.constitution.date,
      attestation: dépôt.constitution.attestation,
    }),
    soumisLe: DateTime.convertirEnValueType(dépôt.soumisLe),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dépôt.dernièreMiseÀJour.date),
      par: Email.convertirEnValueType(dépôt.dernièreMiseÀJour.par),
    },
  },
});
