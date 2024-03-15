import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";
import { List } from "@potentiel-domain/core";
import { Message, MessageHandler, mediator } from "mediateur";
import {
  TypeGarantiesFinancières,
  StatutDépôtGarantiesFinancières,
  DépôtEnCoursGarantiesFinancièresEntity,
  TypeDocumentGarantiesFinancières,
} from "../..";
import { DocumentProjet } from "@potentiel-domain/document";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";

type DépôtEnCoursGarantiesFinancièresListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  régionProjet: Array<string>;
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
  "Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières",
  {
    appelOffre?: string;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  list: List;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  list,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<
    ListerDépôtsEnCoursGarantiesFinancièresQuery
  > = async ({ appelOffre, pagination }) => {
    const result = await list<DépôtEnCoursGarantiesFinancièresEntity>({
      type: "depot-en-cours-garanties-financieres",
      where: {
        ...(appelOffre && { appelOffre }),
      },
      pagination,
    });

    return {
      ...result,
      items: result.items.map((item) => mapToReadModel(item)),
    };
  };
  mediator.register(
    "Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières",
    handler
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
      dépôt.attestation.format
    ),
    soumisLe: DateTime.convertirEnValueType(dépôt.soumisLe),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dépôt.dernièreMiseÀJour.date),
      par: IdentifiantUtilisateur.convertirEnValueType(
        dépôt.dernièreMiseÀJour.par
      ),
    },
  },
});
