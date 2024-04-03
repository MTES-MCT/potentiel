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
import { Option } from '@potentiel-librairies/monads';
import { List } from '@potentiel-domain/core';

export type ListerDépôtsEnCoursGarantiesFinancièresPort = (args: {
  where: {
    appelOffre?: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
  région?: string;
}) => Promise<{
  items: ReadonlyArray<DépôtEnCoursGarantiesFinancièresEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

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
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerDépôtsEnCoursGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
  {
    appelOffre?: string;
    utilisateur: {
      rôle: string;
      email: string;
    };
    pagination: { page: number; itemsPerPage: number };
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  list: List;
  listerDépôtsEnCoursGarantiesFinancières: ListerDépôtsEnCoursGarantiesFinancièresPort;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  list,
  récupérerRégionDreal,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsEnCoursGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur: { email, rôle },
    pagination,
  }) => {
    let région: string | undefined = undefined;

    if (rôle === Role.dreal.nom) {
      const régionDreal = await récupérerRégionDreal(email);
      if (Option.isNone(régionDreal)) {
        throw new CommonError.RégionNonTrouvéeError();
      }

      région = régionDreal.région;
    }

    const where = {
      ...(appelOffre && { appelOffre }),
      ...(région && { régionProjet: région }),
    };

    const result = await list<DépôtEnCoursGarantiesFinancièresEntity>({
      type: 'depot-en-cours-garanties-financieres',
      where,
      pagination,
    });

    return {
      ...result,
      items: result.items.map((item) => mapToReadModel(item)),
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
