import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { CandidatureEntity } from '../candidature.entity';
import { HistoriqueAbandon, Technologie } from '../candidature';

export type ConsulterCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutProjet.ValueType;
  nomProjet: string;
  typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  adresse1: string;
  adresse2: string;
  nomCandidat: string;
  nomReprésentantLégal: string;
  emailContact: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  valeurÉvaluationCarbone?: number;
  technologie: Technologie.ValueType;
  codePostal: string;
  commune: string;
  sociétéMère: string;
  noteTotale: number;
  motifÉlimination: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  financementCollectif: boolean;
  financementParticipatif: boolean;
  gouvernancePartagée: boolean;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
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

export const mapToReadModel = (entity: CandidatureEntity): ConsulterCandidatureReadModel => {
  const {
    identifiantProjet,
    statut,
    historiqueAbandon,
    technologie,
    nomProjet,
    adresse1,
    adresse2,
    nomCandidat,
    nomReprésentantLégal,
    emailContact,
    puissanceProductionAnnuelle,
    prixReference,
    valeurÉvaluationCarbone,
    codePostal,
    commune,
    sociétéMère,
    noteTotale,
    motifÉlimination,
    puissanceALaPointe,
    evaluationCarboneSimplifiée,
    financementCollectif,
    financementParticipatif,
    gouvernancePartagée,
    territoireProjet,
  } = entity;
  const base = {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    statut: StatutProjet.convertirEnValueType(statut),
    historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon),
    technologie: Technologie.convertirEnValueType(technologie),
    nomProjet,
    adresse1,
    adresse2,
    nomCandidat,
    nomReprésentantLégal,
    emailContact,
    puissanceProductionAnnuelle,
    prixReference,
    valeurÉvaluationCarbone,
    codePostal,
    commune,
    sociétéMère,
    noteTotale,
    motifÉlimination,
    puissanceALaPointe,
    evaluationCarboneSimplifiée,
    financementCollectif,
    financementParticipatif,
    gouvernancePartagée,
    territoireProjet,
  };
  if (statut === 'classé') {
    if (entity.typeGarantiesFinancières === 'avec-date-échéance') {
      return {
        ...base,
        dateÉchéanceGf: DateTime.convertirEnValueType(entity.dateÉchéanceGf),
        typeGarantiesFinancières:
          GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
            entity.typeGarantiesFinancières,
          ),
      };
    }
    return {
      ...base,
      typeGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
        entity.typeGarantiesFinancières,
      ),
    };
  }
  return base;
};
