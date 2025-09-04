import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureEntity } from '../candidature.entity';
import { IdentifiantProjet } from '../..';
import { Dépôt, Instruction, TypeTechnologie, UnitéPuissance, VolumeRéservé } from '..';

export type ConsulterCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;
  volumeRéservé: VolumeRéservé.ValueType | undefined;

  misÀJourLe: DateTime.ValueType;

  détailsImport: DocumentProjet.ValueType;

  notification?: {
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: AppelOffre.Validateur;
    /** Optionnel car les projets de périodes "legacy" n'ont pas d'attestation de désignation */
    attestation?: DocumentProjet.ValueType;
  };

  technologie: TypeTechnologie.ValueType<AppelOffre.Technologie>;
  unitéPuissance: UnitéPuissance.ValueType;
};

export type ConsulterCandidatureQuery = Message<
  'Candidature.Query.ConsulterCandidature',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterCandidatureReadModel>
>;

export type ConsulterCandidatureDependencies = {
  find: Find;
};

export const registerConsulterCandidatureQuery = ({ find }: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterCandidatureQuery> = async ({ identifiantProjet }) => {
    const candidature = await find<CandidatureEntity, AppelOffre.AppelOffreEntity>(
      `candidature|${identifiantProjet}`,
      {
        join: {
          entity: 'appel-offre',
          on: 'appelOffre',
        },
      },
    );

    if (Option.isNone(candidature)) {
      return Option.none;
    }
    const appelOffres = candidature['appel-offre'];
    const période = appelOffres.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      return Option.none;
    }

    return mapToReadModel(candidature, appelOffres, période);
  };

  mediator.register('Candidature.Query.ConsulterCandidature', handler);
};

type MapToReadModel = (
  candidature: Omit<CandidatureEntity, 'type'>,
  appelOffres: AppelOffre.AppelOffreReadModel,
  période: AppelOffre.Periode,
) => ConsulterCandidatureReadModel;

export const mapToReadModel: MapToReadModel = (
  candidature,
  appelOffres,
  période,
): ConsulterCandidatureReadModel => {
  const {
    identifiantProjet,

    technologie,

    puissanceProductionAnnuelle,
    noteTotale,

    misÀJourLe,
    détailsMisÀJourLe,
    notification,
  } = candidature;
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    dépôt: Dépôt.convertirEnValueType(candidature),
    instruction: Instruction.convertirEnValueType(candidature),

    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),

    détailsImport: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      'candidature/import',
      détailsMisÀJourLe,
      'application/json',
    ),
    notification: notification && {
      notifiéeLe: DateTime.convertirEnValueType(notification.notifiéeLe),
      notifiéePar: Email.convertirEnValueType(notification.notifiéePar),
      validateur: notification.validateur,
      attestation:
        notification.attestation &&
        DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notification.attestation.généréeLe,
          notification.attestation.format,
        ),
    },
    technologie: TypeTechnologie.déterminer({
      appelOffre: appelOffres,
      projet: candidature,
    }),
    unitéPuissance: UnitéPuissance.déterminer({ appelOffres, période: période.id, technologie }),
    volumeRéservé: VolumeRéservé.déterminer({
      période,
      note: noteTotale,
      puissanceInitiale: puissanceProductionAnnuelle,
    }),
  };
};
