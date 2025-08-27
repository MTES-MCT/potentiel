import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatEntity } from '../lauréat.entity';
import { Candidature, IdentifiantProjet, StatutProjet } from '../..';
import { AbandonEntity } from '../abandon';
import { Abandon } from '..';
import {
  CandidatureEntity,
  Localité,
  TypeTechnologie,
  UnitéPuissance,
  VolumeRéservé,
} from '../../candidature';
import { mapToReadModel as mapToCandidatureReadModel } from '../../candidature/consulter/consulterCandidature.query';
import { AttestationConformitéEntity } from '../achèvement/attestationConformité';

export type ConsulterLauréatReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  technologie: TypeTechnologie.ValueType<AppelOffre.Technologie>;
  unitéPuissance: UnitéPuissance.ValueType;
  statut: StatutProjet.ValueType;
  volumeRéservé?: VolumeRéservé.ValueType;
  attestationDésignation?: DocumentProjet.ValueType;
  autorisationDUrbanisme: Candidature.Dépôt.ValueType['autorisationDUrbanisme'];
} & Pick<
  Candidature.Dépôt.ValueType,
  // on ne sélectionne que des propriétés non modifiables de Candidature
  // Pour des propriétés modifiables comme la puissance, on utilisera ConsulterPuissance
  'emailContact' | 'nomCandidat' | 'prixReference' | 'coefficientKChoisi'
>;

export type ConsulterLauréatQuery = Message<
  'Lauréat.Query.ConsulterLauréat',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterLauréatReadModel>
>;

export type ConsulterLauréatDependencies = {
  find: Find;
};

export const registerConsulterLauréatQuery = ({ find }: ConsulterLauréatDependencies) => {
  const handler: MessageHandler<ConsulterLauréatQuery> = async ({ identifiantProjet }) => {
    const lauréat = await find<LauréatEntity, CandidatureEntity>(`lauréat|${identifiantProjet}`, {
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    if (Option.isNone(lauréat)) {
      return lauréat;
    }
    const appelOffres = await find<AppelOffre.AppelOffreEntity>(
      `appel-offre|${lauréat.candidature.appelOffre}`,
    );
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }
    const période = appelOffres.periodes.find((p) => p.id === lauréat.candidature.période);
    if (!période) {
      return Option.none;
    }
    const candidatureReadModel = mapToCandidatureReadModel(
      lauréat.candidature,
      appelOffres,
      période,
    );
    const achèvement = await find<AttestationConformitéEntity>(
      `attestation-conformité|${identifiantProjet}`,
    );
    if (Option.isSome(achèvement)) {
      return mapToReadModel(lauréat, candidatureReadModel, StatutProjet.achevé);
    }
    const abandon = await find<AbandonEntity>(`abandon|${identifiantProjet}`);
    if (
      Option.isSome(abandon) &&
      Abandon.StatutAbandon.convertirEnValueType(abandon.statut).estAccordé()
    ) {
      return mapToReadModel(lauréat, candidatureReadModel, StatutProjet.abandonné);
    }

    return mapToReadModel(lauréat, candidatureReadModel, StatutProjet.classé);
  };
  mediator.register('Lauréat.Query.ConsulterLauréat', handler);
};

type MapToReadModel = (
  lauréat: LauréatEntity,
  candidature: Candidature.ConsulterCandidatureReadModel,
  statut: StatutProjet.ValueType,
) => ConsulterLauréatReadModel;

const mapToReadModel: MapToReadModel = (
  {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    nomProjet,
    localité: { adresse1, adresse2, codePostal, commune, département, région },
  },
  candidature,
  statut,
) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
  nomProjet,
  localité: Localité.bind({
    adresse1,
    adresse2,
    codePostal,
    commune,
    département,
    région,
  }),
  statut,

  volumeRéservé: candidature.volumeRéservé,
  technologie: candidature.technologie,
  unitéPuissance: candidature.unitéPuissance,
  emailContact: candidature.dépôt.emailContact,
  nomCandidat: candidature.dépôt.nomCandidat,
  prixReference: candidature.dépôt.prixReference,
  coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
  attestationDésignation: candidature.notification?.attestation,
  autorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme,
});
