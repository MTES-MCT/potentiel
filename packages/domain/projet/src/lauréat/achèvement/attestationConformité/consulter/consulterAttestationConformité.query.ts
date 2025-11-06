import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { AttestationConformitéEntity } from '../attestationConformité.entity';
import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { TypeDocumentAttestationConformité } from '..';

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

export const registerConsulterAttestationConformitéQuery = ({
  find,
}: ConsulterAttestationConformitéDependencies) => {
  const handler: MessageHandler<ConsulterAttestationConformitéQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<AttestationConformitéEntity>(
      `attestation-conformité|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel({ ...result, identifiantProjetValueType: identifiantProjet });
  };

  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
    handler,
  );
};

const mapToReadModel = ({
  attestationConformité,
  preuveTransmissionAuCocontractant,
  dernièreMiseÀJour,
  identifiantProjetValueType,
}: AttestationConformitéEntity & {
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterAttestationConformitéReadModel => {
  return {
    identifiantProjet: identifiantProjetValueType,
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjetValueType.formatter(),
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      DateTime.convertirEnValueType(attestationConformité.date).formatter(),
      attestationConformité.format,
    ),
    dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
      preuveTransmissionAuCocontractant.date,
    ),
    preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
      identifiantProjetValueType.formatter(),
      TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
      DateTime.convertirEnValueType(preuveTransmissionAuCocontractant.date).formatter(),
      preuveTransmissionAuCocontractant.format,
    ),
    misÀJourLe: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    misÀJourPar: Email.convertirEnValueType(dernièreMiseÀJour.utilisateur),
  };
};
