import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureEntity } from '../candidature.entity';
import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { IdentifiantProjet } from '../..';
import { Fournisseur } from '../../lauréat/fournisseur';
import { UnitéPuissance, VolumeRéservé } from '..';

export type ConsulterCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: string;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
  nomCandidat: string;
  nomReprésentantLégal: string;
  emailContact: Email.ValueType;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  technologie: TypeTechnologie.ValueType;
  sociétéMère: string;
  noteTotale: number;
  volumeRéservé?: VolumeRéservé.ValueType;
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  coefficientKChoisi?: boolean;
  misÀJourLe: DateTime.ValueType;

  détailsImport: DocumentProjet.ValueType;
  fournisseurs: Array<Fournisseur.ValueType>;

  notification?: {
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: AppelOffre.Validateur;
    attestation?: DocumentProjet.ValueType;
  };

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
  {
    identifiantProjet,
    statut,
    typeGarantiesFinancières,
    historiqueAbandon,
    technologie,
    dateÉchéanceGf,
    nomProjet,
    localité,
    nomCandidat,
    nomReprésentantLégal,
    emailContact,
    puissanceProductionAnnuelle,
    prixReference,
    sociétéMère,
    noteTotale,
    motifÉlimination,
    puissanceALaPointe,
    evaluationCarboneSimplifiée,
    actionnariat,
    territoireProjet,
    coefficientKChoisi,
    misÀJourLe,
    détailsMisÀJourLe,
    notification,
    fournisseurs,
  },
  appelOffres,
  période,
): ConsulterCandidatureReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  statut: StatutCandidature.convertirEnValueType(statut),
  historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon),
  technologie: TypeTechnologie.convertirEnValueType(technologie),
  dateÉchéanceGf: dateÉchéanceGf ? DateTime.convertirEnValueType(dateÉchéanceGf) : undefined,
  typeGarantiesFinancières: typeGarantiesFinancières
    ? TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières)
    : undefined,
  misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
  nomProjet,
  localité,
  nomCandidat,
  nomReprésentantLégal,
  emailContact: Email.convertirEnValueType(emailContact),
  puissanceProductionAnnuelle,
  prixReference,
  sociétéMère,
  noteTotale,
  motifÉlimination,
  puissanceALaPointe,
  evaluationCarboneSimplifiée,
  actionnariat: actionnariat ? TypeActionnariat.convertirEnValueType(actionnariat) : undefined,
  territoireProjet,
  coefficientKChoisi,
  détailsImport: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'candidature/import',
    détailsMisÀJourLe,
    'application/json',
  ),
  fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
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
  unitéPuissance: UnitéPuissance.déterminer({ appelOffres, période: période.id, technologie }),
  volumeRéservé: VolumeRéservé.déterminer({
    période,
    note: noteTotale,
    puissanceInitiale: puissanceProductionAnnuelle,
  }),
});
