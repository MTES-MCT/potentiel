import { Message, MessageHandler, mediator } from 'mediateur';

import { CommonError, CommonPort, DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { List, RangeOptions } from '@potentiel-domain/core';

import {
  TypeGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
  GarantiesFinancièresEntity,
  DépôtAvecDateÉchéance,
  DépôtSansDateÉchéance,
} from '../..';

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
      email: string;
    };
    range?: RangeOptions;
  },
  ListerDépôtsEnCoursGarantiesFinancièresReadModel
>;

export type ListerDépôtsEnCoursGarantiesFinancièresDependencies = {
  list: List;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerDépôtsEnCoursGarantiesFinancièresQuery = ({
  list,
  récupérerRégionDreal,
}: ListerDépôtsEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDépôtsEnCoursGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur: { email, rôle },
    range,
    cycle,
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
    } = await list<GarantiesFinancièresEntity>('garanties-financieres', {
      orderBy: { dépôtEnCours: { miseÀJour: { dernièreMiseÀJourLe: 'descending' } } },
      range,
      where: {
        projet: {
          appelOffre: appelOffre
            ? mapToWhereEqual(appelOffre)
            : cycle
              ? { operator: cycle === 'PPE2' ? 'like' : 'notLike', value: '%PPE2%' }
              : undefined,
          régionProjet: mapToWhereEqual(région),
        },
        dépôtEnCours: {
          type: {
            operator: 'notEqual',
            value: 'aucun',
          },
        },
      },
    });

    return {
      items: items.map((item) => {
        const dépôt = item.dépôtEnCours as DépôtAvecDateÉchéance | DépôtSansDateÉchéance;
        return mapToReadModel(item.identifiantProjet, item.projet, dépôt);
      }),
      range: { endPosition, startPosition },
      total,
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = (
  identifiantProjet: string,
  { nomProjet, régionProjet, appelOffre, famille, période }: GarantiesFinancièresEntity['projet'],
  dépôt: DépôtAvecDateÉchéance | DépôtSansDateÉchéance,
): DépôtEnCoursGarantiesFinancièresListItemReadModel => {
  const { type, attestation, dateConstitution, miseÀJour, soumisLe } = dépôt;

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    appelOffre,
    période,
    famille,
    régionProjet,
    dépôt: {
      type: TypeGarantiesFinancières.convertirEnValueType(type),
      dateÉchéance:
        type === 'avec-date-échéance'
          ? DateTime.convertirEnValueType(dépôt.dateÉchéance)
          : undefined,
      dateConstitution: DateTime.convertirEnValueType(dateConstitution),
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
        dateConstitution,
        attestation.format,
      ),
      soumisLe: DateTime.convertirEnValueType(soumisLe),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(miseÀJour.dernièreMiseÀJourLe),
        par: IdentifiantUtilisateur.convertirEnValueType(miseÀJour.dernièreMiseÀJourPar),
      },
    },
  };
};

const mapToWhereEqual = <T>(value: T | undefined) =>
  value
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;
