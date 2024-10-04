import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import * as StatutCandidature from '../statutCandidature.valueType';
import { CandidatureEntity } from '../candidature.entity';
import { HistoriqueAbandon, TypeActionnariat, TypeTechnologie } from '../candidature';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';

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
  emailContact: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  technologie: TypeTechnologie.ValueType;
  sociétéMère: string;
  noteTotale: number;
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  misÀJourLe: DateTime.ValueType;

  détailsImport: DocumentProjet.ValueType;

  notification?: {
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: {
      fonction: string;
      nomComplet: string;
    };
    attestation: DocumentProjet.ValueType;
  };
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
    const result = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterCandidature', handler);
};

export const mapToReadModel = ({
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
  misÀJourLe,
  notification,
}: CandidatureEntity): ConsulterCandidatureReadModel => ({
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
  emailContact,
  puissanceProductionAnnuelle,
  prixReference,
  sociétéMère,
  noteTotale,
  motifÉlimination,
  puissanceALaPointe,
  evaluationCarboneSimplifiée,
  actionnariat: actionnariat ? TypeActionnariat.convertirEnValueType(actionnariat) : undefined,
  territoireProjet,
  détailsImport: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'candidature/import',
    misÀJourLe,
    'application/json',
  ),
  notification: notification && {
    notifiéeLe: DateTime.convertirEnValueType(notification.notifiéeLe),
    notifiéePar: Email.convertirEnValueType(notification.notifiéePar),
    validateur: {
      fonction: notification.validateur.fonction,
      nomComplet: notification.validateur.nomComplet,
    },
    attestation: DocumentProjet.convertirEnValueType(
      identifiantProjet,
      'attestation',
      notification.notifiéeLe,
      'application/pdf',
    ),
  },
});
