import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/entity';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { DépôtEnCoursGarantiesFinancièresEntity } from '../dépôtEnCoursGarantiesFinancières.entity';
import { TypeDocumentGarantiesFinancières } from '../..';

export type ConsulterDépôtEnCoursGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.ValueType;
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

    const result = await find<DépôtEnCoursGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel({ ...result, identifiantProjetValueType: identifiantProjet });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = ({
  dépôt: { type, attestation, dateConstitution, dateÉchéance, soumisLe, dernièreMiseÀJour },
  identifiantProjetValueType,
}: DépôtEnCoursGarantiesFinancièresEntity & {
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterDépôtEnCoursGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    ...(dateÉchéance && {
      dateÉchéance: DateTime.convertirEnValueType(dateÉchéance),
    }),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    soumisLe: DateTime.convertirEnValueType(soumisLe),
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjetValueType.formatter(),
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      DateTime.convertirEnValueType(dateConstitution).formatter(),
      attestation.format,
    ),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      par: IdentifiantUtilisateur.convertirEnValueType(dernièreMiseÀJour.par),
    },
  },
});
