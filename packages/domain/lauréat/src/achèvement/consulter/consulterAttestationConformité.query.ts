import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import { TypeDocumentAchèvement } from '..';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AchèvementEntity } from '../achèvement.entity';

export type ConsulterAttestationConformitéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  misÀJourLe: DateTime.ValueType;
  misÀJourPar: IdentifiantUtilisateur.ValueType;
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

    const result = await find<AchèvementEntity>(`achevement|${identifiantProjet.formatter()}`);

    if (Option.isNone(result)) {
      return Option.none;
    }

    const {
      attestationConformité: attestation,
      preuveTransmissionAuCocontractant,
      dateTransmissionAttestationConformité: dateTransmission,
      dateTransmissionAuCocontractant,
      dernièreMiseÀJour,
    } = result;

    return {
      identifiantProjet,
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmission).formatter(),
        attestation.format,
      ),
      dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
        dateTransmissionAuCocontractant,
      ),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmissionAuCocontractant).formatter(),
        preuveTransmissionAuCocontractant.format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      misÀJourPar: IdentifiantUtilisateur.convertirEnValueType(dernièreMiseÀJour.utilisateur),
    };
  };

  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
    handler,
  );
};
