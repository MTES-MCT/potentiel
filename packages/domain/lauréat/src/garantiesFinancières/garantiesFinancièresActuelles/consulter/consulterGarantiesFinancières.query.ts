import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancièresEntity } from '../../garantiesFinancières.entity';
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

const mapToReadModel = (
  entity: GarantiesFinancièresEntity & {
    identifiantProjetValueType: IdentifiantProjet.ValueType;
  },
): ConsulterGarantiesFinancièresReadModel => {
  const {
    typeGF,
    attestation,
    dateConstitution,
    soumisLe,
    validéLe,
    miseÀJour,
    identifiantProjetValueType,
  } = entity;

  return {
    identifiantProjet: identifiantProjetValueType,
    garantiesFinancières: {
      type: TypeGarantiesFinancières.convertirEnValueType(typeGF),
      dateÉchéance:
        typeGF === 'avec-date-échéance'
          ? DateTime.convertirEnValueType(entity.dateÉchéance)
          : undefined,
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
        date: DateTime.convertirEnValueType(miseÀJour.dernièreMiseÀJourLe),
        par: miseÀJour.dernièreMiseÀJourPar
          ? IdentifiantUtilisateur.convertirEnValueType(miseÀJour.dernièreMiseÀJourPar)
          : undefined,
      },
    },
  };
};
