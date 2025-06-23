import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureEntity } from '../candidature.entity';
import * as StatutCandidature from '../statutCandidature.valueType';
import { IdentifiantProjet } from '../..';

export type ConsulterAttestationReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: string;

  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  validateur: AppelOffre.Validateur;
  attestation: DocumentProjet.ValueType;
};

export type ConsulterAttestationQuery = Message<
  'Candidature.Query.ConsulterAttestation',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterAttestationReadModel>
>;

export type ConsulterAttestationDependencies = {
  find: Find;
};

export const registerConsulterAttestationQuery = ({ find }: ConsulterAttestationDependencies) => {
  const handler: MessageHandler<ConsulterAttestationQuery> = async ({ identifiantProjet }) => {
    const candidature = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    if (Option.isNone(candidature)) {
      return Option.none;
    }

    return mapToReadModel(candidature);
  };

  mediator.register('Candidature.Query.ConsulterAttestation', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  statut,
  nomProjet,
  notification,
}: CandidatureEntity): Option.Type<ConsulterAttestationReadModel> =>
  notification?.attestation
    ? {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        statut: StatutCandidature.convertirEnValueType(statut),

        nomProjet,
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
      }
    : Option.none;
