import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/entity';

import {
  GarantiesFinancièresDétails,
  GarantiesFinancièresEntity,
} from '../garantiesFinancièresActuelles.entity';
import { StatutGarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';
import { Candidature, IdentifiantProjet } from '../../../..';

export type DétailsGarantiesFinancièresReadModel = {
  type: Candidature.TypeGarantiesFinancières.ValueType;
  statut: StatutGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation?: DocumentProjet.ValueType;
  dateConstitution?: DateTime.ValueType;
  soumisLe?: DateTime.ValueType;
  validéLe?: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par?: Email.ValueType;
  };
};

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: DétailsGarantiesFinancièresReadModel;
};

export type ConsulterGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterGarantiesFinancièresReadModel>
>;

export type ConsulterGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresQuery = ({
  find,
}: ConsulterGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel({
      garantiesFinancières: result.garantiesFinancières,
      identifiantProjetValueType: identifiantProjet,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières', handler);
};

const mapToReadModel = ({
  garantiesFinancières,
  identifiantProjetValueType,
}: {
  garantiesFinancières: GarantiesFinancièresDétails;
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  garantiesFinancières: mapGarantiesFinancièresToReadModel({
    garantiesFinancières,
    identifiantProjetValueType,
  }),
});

export const mapGarantiesFinancièresToReadModel = ({
  garantiesFinancières: {
    statut,
    type,
    attestation,
    dateConstitution,
    dateÉchéance,
    soumisLe,
    validéLe,
    dernièreMiseÀJour,
  },
  identifiantProjetValueType,
}: {
  garantiesFinancières: GarantiesFinancièresDétails;
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}) => ({
  statut: StatutGarantiesFinancières.convertirEnValueType(statut),
  type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
  ...(dateÉchéance && {
    dateÉchéance: DateTime.convertirEnValueType(dateÉchéance),
  }),
  dateConstitution: dateConstitution ? DateTime.convertirEnValueType(dateConstitution) : undefined,
  soumisLe: soumisLe ? DateTime.convertirEnValueType(soumisLe) : undefined,
  validéLe: validéLe ? DateTime.convertirEnValueType(validéLe) : undefined,
  attestation:
    dateConstitution && attestation
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValueType.formatter(),
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
          DateTime.convertirEnValueType(dateConstitution).formatter(),
          attestation.format,
        )
      : undefined,
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    par: dernièreMiseÀJour.par ? Email.convertirEnValueType(dernièreMiseÀJour.par) : undefined,
  },
});
