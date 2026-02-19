import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';

import { AchèvementEntity } from '../achèvement.entity.js';
import { DateAchèvementPrévisionnel, TypeDocumentAttestationConformité } from '../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../index.js';

export type ConsulterAchèvementAchevéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateAchèvementPrévisionnel: DateAchèvementPrévisionnel.ValueType;
  aBénéficiéDuDélaiCDC2022: boolean;

  estAchevé: true;
  attestation: DocumentProjet.ValueType;
  dateAchèvementRéel: DateTime.ValueType;
  preuveTransmissionAuCocontractant: Option.Type<DocumentProjet.ValueType>;
  misÀJourLe: DateTime.ValueType;
  misÀJourPar: Email.ValueType;
};

export type ConsulterAchèvementNonAchevéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateAchèvementPrévisionnel: DateAchèvementPrévisionnel.ValueType;
  aBénéficiéDuDélaiCDC2022: boolean;

  estAchevé: false;
};

export type ConsulterAchèvementReadModel =
  | ConsulterAchèvementAchevéReadModel
  | ConsulterAchèvementNonAchevéReadModel;

export type ConsulterAchèvementQuery = Message<
  'Lauréat.Achèvement.Query.ConsulterAchèvement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterAchèvementReadModel>
>;

export type ConsulterAchèvementDependencies = {
  find: Find;
};

export const registerConsulterAchèvementQuery = ({ find }: ConsulterAchèvementDependencies) => {
  const handler: MessageHandler<ConsulterAchèvementQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const achèvementEntity = await find<AchèvementEntity>(
      `achèvement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(achèvementEntity)) {
      return Option.none;
    }

    return mapToReadModel(achèvementEntity);
  };

  mediator.register('Lauréat.Achèvement.Query.ConsulterAchèvement', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  prévisionnel: { date: dateAchèvementPrévisionnel, aBénéficiéDuDélaiCDC2022 },
  réel,
}: AchèvementEntity): ConsulterAchèvementReadModel => {
  const common = {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    dateAchèvementPrévisionnel: DateAchèvementPrévisionnel.convertirEnValueType(
      dateAchèvementPrévisionnel,
    ),
    aBénéficiéDuDélaiCDC2022: aBénéficiéDuDélaiCDC2022 ?? false,
  };
  if (!réel) {
    return {
      ...common,
      estAchevé: false,
    };
  }
  const {
    date: dateAchèvementRéel,
    attestationConformité,
    preuveTransmissionAuCocontractant,
    dernièreMiseÀJour,
  } = réel;
  return {
    ...common,
    estAchevé: true,
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      DateTime.convertirEnValueType(attestationConformité.transmiseLe).formatter(),
      attestationConformité.format,
    ),
    dateAchèvementRéel: DateTime.convertirEnValueType(dateAchèvementRéel),
    preuveTransmissionAuCocontractant: preuveTransmissionAuCocontractant
      ? DocumentProjet.convertirEnValueType(
          identifiantProjet,
          TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
          DateTime.convertirEnValueType(preuveTransmissionAuCocontractant.transmiseLe).formatter(),
          preuveTransmissionAuCocontractant.format,
        )
      : Option.none,
    misÀJourLe: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    misÀJourPar: Email.convertirEnValueType(dernièreMiseÀJour.utilisateur),
  };
};
