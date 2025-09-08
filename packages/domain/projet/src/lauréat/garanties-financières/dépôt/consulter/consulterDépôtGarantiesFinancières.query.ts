import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/entity';

import { TypeDocumentGarantiesFinancières } from '../..';
import { Candidature, IdentifiantProjet } from '../../../..';
import { DépôtGarantiesFinancièresEntity } from '../dépôtGarantiesFinancières.entity';

export type ConsulterDépôtGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dépôt: {
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: Email.ValueType;
    };
  };
};

export type ConsulterDépôtGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDépôtGarantiesFinancièresReadModel>
>;

export type ConsulterDépôtGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterDépôtGarantiesFinancièresQuery = ({
  find,
}: ConsulterDépôtGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterDépôtGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<DépôtGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel({ ...result, identifiantProjetValueType: identifiantProjet });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = ({
  dépôt: { type, attestation, dateConstitution, dateÉchéance, soumisLe, dernièreMiseÀJour },
  identifiantProjetValueType,
}: DépôtGarantiesFinancièresEntity & {
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterDépôtGarantiesFinancièresReadModel => ({
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
      par: Email.convertirEnValueType(dernièreMiseÀJour.par),
    },
  },
});
