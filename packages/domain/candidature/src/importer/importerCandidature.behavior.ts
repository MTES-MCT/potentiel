import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutCandidature.RawType;
    typeGarantiesFinancières?: string;
    historiqueAbandon: string;
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
    nomProjet: string;
    sociétéMère?: string;
    nomCandidat: string;
    puissanceProductionAnnuelle: number;
    prixReference: number;
    noteTotale: number;
    nomReprésentantLégal: string;
    emailContact: string;
    adresse1: string;
    adresse2?: string;
    codePostal: string;
    commune: string;
    motifÉlimination?: string;
    puissanceALaPointe?: boolean;
    evaluationCarboneSimplifiée: number | 'N/A';
    valeurÉvaluationCarbone?: number;
    technologie?: Technologie.RawType;
    financementCollectif: boolean;
    gouvernancePartagée: boolean;
    dateÉchéanceGf?: DateTime.RawType;
    détails?: Record<string, string>;
  }
>;

type ImporterCandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: string;
  historiqueAbandon: string;
  appelOffre: string;
  période: string;
  famille?: string;
  numéroCRE: string;
  nomProjet: string;
  sociétéMère?: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  adresse1: string;
  adresse2?: string;
  codePostal: string;
  commune: string;
  motifÉlimination?: string;
  puissanceALaPointe?: boolean;
  evaluationCarboneSimplifiée: number | 'N/A';
  valeurÉvaluationCarbone?: number;
  technologie?: Technologie.ValueType;
  financementCollectif: boolean;
  gouvernancePartagée: boolean;
  dateÉchéanceGf?: DateTime.ValueType;
  détails?: Record<string, string>;
};

export async function importer(
  this: CandidatureAggregate,
  candidature: ImporterCandidatureOptions,
) {
  const event: CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V1',
    payload: {
      identifiantProjet: candidature.identifiantProjet.formatter(),
      statut: candidature.statut.statut,
      technologie: candidature.technologie?.type,
      dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),

      typeGarantiesFinancières: candidature.typeGarantiesFinancières,
      historiqueAbandon: candidature.historiqueAbandon,
      appelOffre: candidature.appelOffre,
      période: candidature.période,
      famille: candidature.famille,
      numéroCRE: candidature.numéroCRE,
      nomProjet: candidature.nomProjet,
      sociétéMère: candidature.sociétéMère,
      nomCandidat: candidature.nomCandidat,
      puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
      prixReference: candidature.prixReference,
      noteTotale: candidature.noteTotale,
      nomReprésentantLégal: candidature.nomReprésentantLégal,
      emailContact: candidature.emailContact,
      adresse1: candidature.adresse1,
      adresse2: candidature.adresse2,
      codePostal: candidature.codePostal,
      commune: candidature.commune,
      motifÉlimination: candidature.motifÉlimination,
      puissanceALaPointe: candidature.puissanceALaPointe,
      evaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
      valeurÉvaluationCarbone: candidature.valeurÉvaluationCarbone,
      financementCollectif: candidature.financementCollectif,
      gouvernancePartagée: candidature.gouvernancePartagée,
      détails: candidature.détails,
    },
  };
  await this.publish(event);
}

export function applyCandidatureImportée(
  this: CandidatureAggregate,
  { payload: { statut } }: CandidatureImportéeEvent,
) {
  this.statut = StatutCandidature.convertirEnValueType(statut);
}
