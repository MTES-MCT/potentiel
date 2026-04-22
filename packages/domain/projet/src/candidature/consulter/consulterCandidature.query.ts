import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureEntity } from '../candidature.entity.js';
import { DocumentProjet, IdentifiantProjet } from '../../index.js';
import {
  DocumentCandidature,
  Dépôt,
  Instruction,
  TypeTechnologie,
  UnitéPuissance,
} from '../index.js';

export type ConsulterCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;

  miseÀJourLe: DateTime.ValueType;

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
    const candidature = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    if (Option.isNone(candidature)) {
      return Option.none;
    }

    return mapToReadModel(candidature);
  };

  mediator.register('Candidature.Query.ConsulterCandidature', handler);
};

type MapToReadModel = (
  candidature: Omit<CandidatureEntity, 'type'>,
) => ConsulterCandidatureReadModel;

export const mapToReadModel: MapToReadModel = (candidature): ConsulterCandidatureReadModel => {
  const { identifiantProjet, miseÀJourLe, notification } = candidature;

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),

    dépôt: Dépôt.convertirEnValueType(candidature),
    instruction: Instruction.convertirEnValueType(candidature),

    miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),

    notification: notification && {
      notifiéeLe: DateTime.convertirEnValueType(notification.notifiéeLe),
      notifiéePar: Email.convertirEnValueType(notification.notifiéePar),
      validateur: notification.validateur,
      attestation:
        notification.attestation &&
        DocumentCandidature.attestationDésignation({
          identifiantProjet,
          généréeLe: notification.attestation.généréeLe,
          attestation: notification.attestation,
        }),
    },
    technologie: TypeTechnologie.convertirEnValueType(candidature.technologieCalculée),
    unitéPuissance: UnitéPuissance.convertirEnValueType(candidature.unitéPuissance),
  };
};
