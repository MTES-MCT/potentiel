import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  GarantiesFinancières,
  DocumentGarantiesFinancières,
  GarantiesFinancièresEntity,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterDépôtGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: GarantiesFinancières.ValueType;
  document: DocumentProjet.ValueType;
  soumisLe: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: Email.ValueType;
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

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result) || result.dépôt === undefined) {
      return Option.none;
    }

    return mapToReadModel({ ...result, dépôt: result.dépôt });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
    handler,
  );
};

type MapToReadModel = (
  garantiesFinancièresEntity: GarantiesFinancièresEntity & {
    dépôt: NonNullable<GarantiesFinancièresEntity['dépôt']>;
  },
) => ConsulterDépôtGarantiesFinancièresReadModel;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, dépôt }) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    garantiesFinancières: GarantiesFinancières.convertirEnValueType({
      type: dépôt.type,
      dateÉchéance: dépôt.type === 'avec-date-échéance' ? dépôt.dateÉchéance : undefined,
      constitution: dépôt.constitution,
    }),
    soumisLe: DateTime.convertirEnValueType(dépôt.soumisLe),
    document: DocumentGarantiesFinancières.attestationSoumise({
      identifiantProjet,
      dateConstitution: dépôt.constitution.date,
      attestation: dépôt.constitution.attestation,
    }),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dépôt.dernièreMiseÀJour.date),
      par: Email.convertirEnValueType(dépôt.dernièreMiseÀJour.par),
    },
  };
};
