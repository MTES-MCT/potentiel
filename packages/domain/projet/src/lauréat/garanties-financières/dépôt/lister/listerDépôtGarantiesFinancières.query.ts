import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../../lauréat.entity';
import { DépôtGarantiesFinancièresEntity } from '../dépôtGarantiesFinancières.entity';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { TypeDocumentGarantiesFinancières } from '../..';

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
    appelOffre?: string;
    cycle?: string;
    identifiantUtilisateur: string;
    range?: RangeOptions;
  },
  ListerDépôtsGarantiesFinancièresReadModel
>;

export type ListerDépôtsGarantiesFinancièresDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
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
    } = await list<DépôtGarantiesFinancièresEntity, LauréatEntity>(
      'depot-en-cours-garanties-financieres',
      {
        orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
        range,
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre
              ? Where.equal(appelOffre)
              : cycle
                ? cycle === 'PPE2'
                  ? Where.like('PPE2')
                  : Where.notContains('PPE2')
                : undefined,
            localité: {
              région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
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

  mediator.register('Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières', handler);
};

const mapToReadModel = ({
  lauréat: { nomProjet },
  identifiantProjet,
  dépôt,
}: DépôtGarantiesFinancièresEntity &
  Joined<LauréatEntity>): DépôtGarantiesFinancièresListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(dépôt.type),
    dateÉchéance: dépôt.dateÉchéance
      ? DateTime.convertirEnValueType(dépôt.dateÉchéance)
      : undefined,
    dateConstitution: DateTime.convertirEnValueType(dépôt.dateConstitution),
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      dépôt.dateConstitution,
      dépôt.attestation.format,
    ),
    soumisLe: DateTime.convertirEnValueType(dépôt.soumisLe),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dépôt.dernièreMiseÀJour.date),
      par: Email.convertirEnValueType(dépôt.dernièreMiseÀJour.par),
    },
  },
});
