import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import {
  IdentifiantUtilisateur,
  RécupérerIdentifiantsProjetParEmailPorteur,
} from '@potentiel-domain/utilisateur';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Candidature } from '@potentiel-domain/candidature';

import { DépôtEnCoursGarantiesFinancièresEntity, TypeDocumentGarantiesFinancières } from '../..';
import { getRoleBasedWhereCondition, Utilisateur } from '../../_utils/getRoleBasedWhereCondition';

type DépôtEnCoursGarantiesFinancièresListItemReadModel = {
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
    utilisateur: Utilisateur;
    range?: RangeOptions;
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsEnCoursGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur,
    range,
    cycle,
  }) => {
    const {
      items,
      range: { startPosition, endPosition },
      total,
    } = await list<DépôtEnCoursGarantiesFinancièresEntity>('depot-en-cours-garanties-financieres', {
      orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
      range,
      where: {
        appelOffre: cycle
          ? cycle === 'PPE2'
            ? Where.contains('PPE2')
            : Where.notContains('PPE2')
          : Where.equal(appelOffre),
        ...(await getRoleBasedWhereCondition(
          utilisateur,
          récupérerIdentifiantsProjetParEmailPorteur,
        )),
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
      par: IdentifiantUtilisateur.convertirEnValueType(dépôt.dernièreMiseÀJour.par),
    },
  },
});
