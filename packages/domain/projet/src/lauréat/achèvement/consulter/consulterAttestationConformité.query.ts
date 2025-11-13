import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentAttestationConformité } from '..';
import { AchèvementEntity } from '../achèvement.entity';

export type ConsulterAttestationConformitéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  misÀJourLe: DateTime.ValueType;
  misÀJourPar: Email.ValueType;
};

export type ConsulterAttestationConformitéQuery = Message<
  'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterAttestationConformitéReadModel>
>;

export type ConsulterAttestationConformitéDependencies = {
  find: Find;
};

/**
 *
 * @deprecated On maintient cette query en attente de merge avec consulter achèvement
 */
export const registerConsulterAttestationConformitéQuery = ({
  find,
}: ConsulterAttestationConformitéDependencies) => {
  const handler: MessageHandler<ConsulterAttestationConformitéQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<AchèvementEntity>(`achèvement|${identifiantProjet.formatter()}`);

    if (Option.isNone(result) || !result.réel) {
      return Option.none;
    }

    return mapToReadModel({ ...result, réel: result.réel });
  };

  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
    handler,
  );
};

type MapToReadModelProps = AchèvementEntity & {
  réel: NonNullable<AchèvementEntity['réel']>;
};

const mapToReadModel = ({
  réel: { attestationConformité, preuveTransmissionAuCocontractant, dernièreMiseÀJour },
  identifiantProjet,
}: MapToReadModelProps): ConsulterAttestationConformitéReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      DateTime.convertirEnValueType(attestationConformité.date).formatter(),
      attestationConformité.format,
    ),
    dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
      preuveTransmissionAuCocontractant.date,
    ),
    preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
      DateTime.convertirEnValueType(preuveTransmissionAuCocontractant.date).formatter(),
      preuveTransmissionAuCocontractant.format,
    ),
    misÀJourLe: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    misÀJourPar: Email.convertirEnValueType(dernièreMiseÀJour.utilisateur),
  };
};
