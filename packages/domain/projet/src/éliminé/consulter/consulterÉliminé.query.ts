import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';

import { ÉliminéEntity } from '../éliminé.entity.js';
import { Candidature, DocumentProjet, IdentifiantProjet } from '../../index.js';
import { CandidatureEntity, UnitéPuissance } from '../../candidature/index.js';
import { mapToReadModel as mapToCandidatureReadModel } from '../../candidature/consulter/consulterCandidature.query.js';

export type ConsulterÉliminéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestationDésignation?: DocumentProjet.ValueType;
  unitéPuissance: UnitéPuissance.ValueType;
} & Pick<
  Candidature.Dépôt.ValueType,
  | 'emailContact'
  | 'localité'
  | 'nomProjet'
  | 'nomCandidat'
  | 'puissance'
  | 'puissanceDeSite'
  | 'prixReference'
  | 'nomReprésentantLégal'
  | 'sociétéMère'
  | 'autorisationDUrbanisme'
  | 'actionnariat'
  | 'evaluationCarboneSimplifiée'
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

    const candidatureReadModel = mapToCandidatureReadModel(éliminé.candidature);

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

  localité: candidature.dépôt.localité,
  nomProjet: candidature.dépôt.nomProjet,
  nomCandidat: candidature.dépôt.nomCandidat,
  emailContact: candidature.dépôt.emailContact,
  nomReprésentantLégal: candidature.dépôt.nomReprésentantLégal,
  sociétéMère: candidature.dépôt.sociétéMère,
  prixReference: candidature.dépôt.prixReference,
  puissance: candidature.dépôt.puissance,
  puissanceDeSite: candidature.dépôt.puissanceDeSite,
  unitéPuissance: candidature.unitéPuissance,
  attestationDésignation: candidature.notification?.attestation,
  autorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme
    ? {
        date: candidature.dépôt.autorisationDUrbanisme.date,
        numéro: candidature.dépôt.autorisationDUrbanisme.numéro,
      }
    : undefined,
  actionnariat: candidature.dépôt.actionnariat,
  evaluationCarboneSimplifiée: candidature.dépôt.evaluationCarboneSimplifiée,
});
