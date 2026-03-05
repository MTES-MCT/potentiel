import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  GarantiesFinancièresDétails,
  GarantiesFinancièresEntity,
} from '../../garantiesFinancières.entity.js';
import {
  GarantiesFinancières,
  StatutGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: GarantiesFinancières.ValueType;
  statut: StatutGarantiesFinancières.ValueType;
  motifEnAttente?: string;
  dateLimiteSoumission?: DateTime.ValueType;
  document?: DocumentProjet.ValueType;
  soumisLe?: DateTime.ValueType;
  validéLe?: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par?: Email.ValueType;
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

    return mapToReadModel({
      identifiantProjet,
      garantiesFinancières: result.garantiesFinancières,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières', handler);
};

type MapToReadModelProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: GarantiesFinancièresDétails;
};

export const mapToReadModel = ({
  garantiesFinancières: {
    dernièreMiseÀJour,
    statut,
    type,
    dateÉchéance,
    dateConstitution,
    soumisLe,
    validéLe,
    attestation,
    motifEnAttente,
    dateLimiteSoumission,
  },
  identifiantProjet,
}: MapToReadModelProps): ConsulterGarantiesFinancièresReadModel => {
  return {
    identifiantProjet,
    statut: StatutGarantiesFinancières.convertirEnValueType(statut),
    garantiesFinancières: GarantiesFinancières.convertirEnValueType({
      type,
      dateÉchéance,
      attestation,
      dateConstitution,
    }),
    soumisLe: soumisLe ? DateTime.convertirEnValueType(soumisLe) : undefined,
    validéLe: validéLe ? DateTime.convertirEnValueType(validéLe) : undefined,
    document:
      dateConstitution && attestation
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
            DateTime.convertirEnValueType(dateConstitution).formatter(),
            attestation.format,
          )
        : undefined,
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      par: dernièreMiseÀJour.par ? Email.convertirEnValueType(dernièreMiseÀJour.par) : undefined,
    },

    motifEnAttente,
    dateLimiteSoumission: dateLimiteSoumission
      ? DateTime.convertirEnValueType(dateLimiteSoumission)
      : undefined,
  };
};
