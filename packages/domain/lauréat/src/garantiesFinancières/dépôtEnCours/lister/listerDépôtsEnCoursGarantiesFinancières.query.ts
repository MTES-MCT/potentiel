import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';
import { List, RangeOptions } from '@potentiel-domain/core';

import {
  TypeGarantiesFinancières,
  DépôtEnCoursGarantiesFinancièresEntity,
  TypeDocumentGarantiesFinancières,
} from '../..';

type DépôtEnCoursGarantiesFinancièresListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  dépôt: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    soumisLe: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: IdentifiantUtilisateur.ValueType;
    };
  };
};

export type ListerDépôtsEnCoursGarantiesFinancièresReadModel = {
  items: ReadonlyArray<DépôtEnCoursGarantiesFinancièresListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDépôtsEnCoursGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
  {
    appelOffre?: string;
    cycle?: string;
    utilisateur: {
      rôle: string;
      régionDreal?: string;
    };
    range?: RangeOptions;
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  list: List;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  list,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsEnCoursGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur: { régionDreal, rôle },
    range,
    cycle,
  }) => {
    const région = Role.convertirEnValueType(rôle).estÉgaleÀ(Role.dreal)
      ? régionDreal ?? 'non-trouvée'
      : undefined;

    const {
      items,
      range: { startPosition, endPosition },
      total,
    } = await list<DépôtEnCoursGarantiesFinancièresEntity>('depot-en-cours-garanties-financieres', {
      orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
      range,
      where: {
        ...(appelOffre && {
          appelOffre: { operator: 'equal', value: appelOffre },
        }),
        ...(région && {
          régionProjet: { operator: 'equal', value: région },
        }),
        ...(cycle && {
          appelOffre: { operator: cycle === 'PPE2' ? 'like' : 'notLike', value: '%PPE2%' },
        }),
      },
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      range: { endPosition, startPosition },
      total,
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = ({
  nomProjet,
  identifiantProjet,
  dépôt,
}: DépôtEnCoursGarantiesFinancièresEntity): DépôtEnCoursGarantiesFinancièresListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  dépôt: {
    type: TypeGarantiesFinancières.convertirEnValueType(dépôt.type),
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
      par: IdentifiantUtilisateur.convertirEnValueType(dépôt.dernièreMiseÀJour.par),
    },
  },
});
