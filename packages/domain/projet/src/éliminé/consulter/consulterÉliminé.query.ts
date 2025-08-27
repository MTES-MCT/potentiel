import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DocumentProjet } from '@potentiel-domain/document';

import { ÉliminéEntity } from '../éliminé.entity';
import { Candidature, IdentifiantProjet, StatutProjet } from '../..';
import { CandidatureEntity, UnitéPuissance } from '../../candidature';
import { mapToReadModel as mapToCandidatureReadModel } from '../../candidature/consulter/consulterCandidature.query';

export type ConsulterÉliminéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  statut: StatutProjet.ValueType;
  attestationDésignation?: DocumentProjet.ValueType;
  unitéPuissance: UnitéPuissance.ValueType;
} & Pick<
  Candidature.Dépôt.ValueType,
  | 'emailContact'
  | 'localité'
  | 'nomProjet'
  | 'nomCandidat'
  | 'puissanceProductionAnnuelle'
  | 'prixReference'
  | 'nomReprésentantLégal'
  | 'sociétéMère'
  | 'autorisationDUrbanisme'
>;

export type ConsulterÉliminéQuery = Message<
  'Éliminé.Query.ConsulterÉliminé',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterÉliminéReadModel>
>;

export type ConsulterÉliminéDependencies = {
  find: Find;
};

export const registerConsulterÉliminéQuery = ({ find }: ConsulterÉliminéDependencies) => {
  const handler: MessageHandler<ConsulterÉliminéQuery> = async ({ identifiantProjet }) => {
    const éliminé = await find<ÉliminéEntity, CandidatureEntity>(`éliminé|${identifiantProjet}`, {
      join: { entity: 'candidature', on: 'identifiantProjet' },
    });
    if (Option.isNone(éliminé)) {
      return éliminé;
    }

    const appelOffres = await find<AppelOffre.AppelOffreEntity>(
      `appel-offre|${éliminé.candidature.appelOffre}`,
    );
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }
    const période = appelOffres.periodes.find((p) => p.id === éliminé.candidature.période);
    if (!période) {
      return Option.none;
    }
    const candidatureReadModel = mapToCandidatureReadModel(
      éliminé.candidature,
      appelOffres,
      période,
    );

    return mapToReadModel(éliminé, candidatureReadModel);
  };
  mediator.register('Éliminé.Query.ConsulterÉliminé', handler);
};

type MapToReadModel = (
  éliminé: ÉliminéEntity,
  candidature: Candidature.ConsulterCandidatureReadModel,
) => ConsulterÉliminéReadModel;

const mapToReadModel: MapToReadModel = (
  { identifiantProjet, notifiéLe, notifiéPar },
  candidature,
) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
  statut: StatutProjet.éliminé,

  localité: candidature.dépôt.localité,
  nomProjet: candidature.dépôt.nomProjet,
  nomCandidat: candidature.dépôt.nomCandidat,
  emailContact: candidature.dépôt.emailContact,
  nomReprésentantLégal: candidature.dépôt.nomReprésentantLégal,
  sociétéMère: candidature.dépôt.sociétéMère,
  prixReference: candidature.dépôt.prixReference,
  puissanceProductionAnnuelle: candidature.dépôt.puissanceProductionAnnuelle,
  unitéPuissance: candidature.unitéPuissance,
  attestationDésignation: candidature.notification?.attestation,
  autorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme
    ? {
        date: candidature.dépôt.autorisationDUrbanisme.date,
        numéro: candidature.dépôt.autorisationDUrbanisme.numéro,
      }
    : undefined,
});
