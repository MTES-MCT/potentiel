import { CommonError, CommonPort, DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  TypeGarantiesFinancières,
  StatutDépôtGarantiesFinancières,
  DépôtEnCoursGarantiesFinancièresEntity,
  TypeDocumentGarantiesFinancières,
} from '../..';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { ListV2, RangeOptions } from '@potentiel-domain/core';

type DépôtEnCoursGarantiesFinancièresListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  régionProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  dépôt: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    statut: StatutDépôtGarantiesFinancières.ValueType;
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
    utilisateur: {
      rôle: string;
      email: string;
    };
    range?: RangeOptions;
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  listV2: ListV2;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  listV2,
  récupérerRégionDreal,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsEnCoursGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur: { email, rôle },
    range,
  }) => {
    let région: string | undefined = undefined;

    /**
     * @todo on devrait passer uniquement la région dans la query et pas les infos utilisateur pour le déterminer
     */
    if (rôle === Role.dreal.nom) {
      const régionDreal = await récupérerRégionDreal(email);
      if (Option.isNone(régionDreal)) {
        throw new CommonError.RégionNonTrouvéeError();
      }

      région = régionDreal.région;
    }

    const {
      items,
      range: { startPosition, endPosition },
      total,
    } = await listV2<DépôtEnCoursGarantiesFinancièresEntity>(
      'depot-en-cours-garanties-financieres',
      {
        orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
        range,
        where: {
          ...(appelOffre && {
            appelOffre: { operator: 'equal', value: appelOffre },
          }),
          ...(région && {
            régionProjet: { operator: 'equal', value: région },
          }),
        },
      },
    );

    return {
      items: items.map((item) => mapToReadModel(item)),
      range: { endPosition: endPosition, startPosition: startPosition },
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
  appelOffre,
  identifiantProjet,
  période,
  régionProjet,
  famille,
  dépôt,
}: DépôtEnCoursGarantiesFinancièresEntity): DépôtEnCoursGarantiesFinancièresListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  période,
  famille,
  régionProjet,
  dépôt: {
    type: TypeGarantiesFinancières.convertirEnValueType(dépôt.type),
    dateÉchéance: dépôt.dateÉchéance
      ? DateTime.convertirEnValueType(dépôt.dateÉchéance)
      : undefined,
    statut: StatutDépôtGarantiesFinancières.convertirEnValueType(dépôt.statut),
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
