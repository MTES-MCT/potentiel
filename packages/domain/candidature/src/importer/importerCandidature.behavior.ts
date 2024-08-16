import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { PériodeAppelOffreLegacyError } from '../périodeAppelOffreLegacy.error';
import { CandidatureDéjàImportéeError } from '../candidatureDéjàImportée.error';
import { AppelOffreInexistantError } from '../appelOffreInexistant.error';
import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  GarantiesFinancièresRequisesPourAppelOffreError,
} from '../garantiesFinancièresRequises.error';

export type CandidatureImportéeBehaviorPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutCandidature.RawType;
  typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  motifÉlimination: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  valeurÉvaluationCarbone?: number;
  technologie: Technologie.RawType;
  financementCollectif: boolean;
  financementParticipatif: boolean;
  gouvernancePartagée: boolean;
  dateÉchéanceGf?: DateTime.RawType;
  territoireProjet: string;
  détails: Record<string, string>;
};

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V1',
  CandidatureImportéeBehaviorPayload
>;

export type ImporterCandidatureBehaviorOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: string;
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  motifÉlimination: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  valeurÉvaluationCarbone?: number;
  technologie: Technologie.ValueType;
  financementCollectif: boolean;
  financementParticipatif: boolean;
  gouvernancePartagée: boolean;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  détails: Record<string, string>;
};

export async function importer(
  this: CandidatureAggregate,
  candidature: ImporterCandidatureBehaviorOptions,
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) {
  if (this.importé) {
    throw new CandidatureDéjàImportéeError();
  }

  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(candidature.appelOffre);
  }
  const période = this.récupererPériodeAO(appelOffre, candidature.période);
  const famille = this.récupererFamilleAO(appelOffre, candidature.période, candidature.famille);

  if (période.type === 'legacy') {
    throw new PériodeAppelOffreLegacyError(candidature.appelOffre, candidature.période);
  }

  const soumisAuxGF =
    famille?.soumisAuxGarantiesFinancieres ?? appelOffre.soumisAuxGarantiesFinancieres;
  if (
    soumisAuxGF === 'à la candidature' &&
    candidature.statut.estClassé() &&
    !candidature.typeGarantiesFinancières
  ) {
    throw new GarantiesFinancièresRequisesPourAppelOffreError();
  }

  if (
    candidature.typeGarantiesFinancières &&
    candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    !candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
  }

  const event: CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V1',
    payload: mapToEventPayload(candidature),
  };
  await this.publish(event);
}

export function applyCandidatureImportée(
  this: CandidatureAggregate,
  { payload }: CandidatureImportéeEvent,
) {
  this.importé = true;
  this.statut = StatutCandidature.convertirEnValueType(payload.statut);
  this.payloadHash = this.calculerHash(payload);
}

export const mapToEventPayload = (
  candidature: ImporterCandidatureBehaviorOptions,
): CandidatureImportéeEvent['payload'] => ({
  identifiantProjet: candidature.identifiantProjet.formatter(),
  statut: candidature.statut.statut,
  technologie: candidature.technologie.type,
  dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),
  historiqueAbandon: candidature.historiqueAbandon.formatter(),
  typeGarantiesFinancières: candidature.typeGarantiesFinancières?.type,
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
  financementParticipatif: candidature.financementParticipatif,
  gouvernancePartagée: candidature.gouvernancePartagée,
  territoireProjet: candidature.territoireProjet,
  détails: candidature.détails,
});
