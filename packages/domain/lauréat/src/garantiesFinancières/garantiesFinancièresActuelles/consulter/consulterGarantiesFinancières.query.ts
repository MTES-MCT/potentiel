import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancièresEntity } from '../garantiesFinancièresActuelles.entity';
import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '../..';

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation?: DocumentProjet.ValueType;
    dateConstitution?: DateTime.ValueType;
    soumisLe?: DateTime.ValueType;
    validéLe?: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par?: IdentifiantUtilisateur.ValueType;
    };
  };
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

    return mapToReadModel({ ...result, identifiantProjetValueType: identifiantProjet });
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières', handler);
};

const mapToReadModel = ({
  garantiesFinancières: {
    type,
    attestation,
    dateConstitution,
    dateÉchéance,
    soumisLe,
    validéLe,
    dernièreMiseÀJour,
  },
  identifiantProjetValueType,
}: GarantiesFinancièresEntity & {
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  garantiesFinancières: {
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    ...(dateÉchéance && {
      dateÉchéance: DateTime.convertirEnValueType(dateÉchéance),
    }),
    dateConstitution: dateConstitution
      ? DateTime.convertirEnValueType(dateConstitution)
      : undefined,
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
      par: dernièreMiseÀJour.par
        ? IdentifiantUtilisateur.convertirEnValueType(dernièreMiseÀJour.par)
        : undefined,
    },
  },
});
