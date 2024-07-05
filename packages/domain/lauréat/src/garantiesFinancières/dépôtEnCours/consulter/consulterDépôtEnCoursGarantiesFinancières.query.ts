import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import {
  DépôtAvecDateÉchéance,
  DépôtSansDateÉchéance,
  GarantiesFinancièresEntity,
} from '../../garantiesFinancières.entity';
import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '../..';

export type ConsulterDépôtEnCoursGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dépôt: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: IdentifiantUtilisateur.ValueType;
    };
  };
};

export type ConsulterDépôtEnCoursGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDépôtEnCoursGarantiesFinancièresReadModel>
>;

export type ConsulterDépôtEnCoursGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterDépôtEnCoursGarantiesFinancièresQuery = ({
  find,
}: ConsulterDépôtEnCoursGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterDépôtEnCoursGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result) || result.dépôtEnCours.type === 'aucun') {
      return Option.none;
    }

    return mapToReadModel(result.dépôtEnCours, identifiantProjet);
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = (
  entity: DépôtAvecDateÉchéance | DépôtSansDateÉchéance,
  identifiantProjetValueType: IdentifiantProjet.ValueType,
) => {
  const { type, attestation, dateConstitution, miseÀJour, soumisLe } = entity;
  return {
    identifiantProjet: identifiantProjetValueType,
    dépôt: {
      type: TypeGarantiesFinancières.convertirEnValueType(type),

      dateÉchéance:
        type === 'avec-date-échéance'
          ? DateTime.convertirEnValueType(entity.dateÉchéance)
          : undefined,
      dateConstitution: DateTime.convertirEnValueType(dateConstitution),
      soumisLe: DateTime.convertirEnValueType(soumisLe),
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjetValueType.formatter(),
        TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
        DateTime.convertirEnValueType(dateConstitution).formatter(),
        attestation.format,
      ),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(miseÀJour.dernièreMiseÀJourLe),
        par: IdentifiantUtilisateur.convertirEnValueType(miseÀJour.dernièreMiseÀJourPar),
      },
    },
  };
};
