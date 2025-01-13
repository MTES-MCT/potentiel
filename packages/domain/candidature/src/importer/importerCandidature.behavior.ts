import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { PériodeAppelOffreLegacyError } from '../périodeAppelOffreLegacy.error';
import { CandidatureDéjàImportéeError } from '../candidatureDéjàImportée.error';
import { AppelOffreInexistantError } from '../appelOffreInexistant.error';
import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
  GarantiesFinancièresRequisesPourAppelOffreError,
} from '../garantiesFinancières.error';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';

export type CandidatureImportéeEventCommonPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutCandidature.RawType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.RawType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  actionnariat?: TypeActionnariat.RawType;
  dateÉchéanceGf?: DateTime.RawType;
  territoireProjet: string;
};

type CandidatureImportéeEventPayload = CandidatureImportéeEventCommonPayload & {
  importéLe: DateTime.RawType;
  importéPar: Email.RawType;
};

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V1',
  CandidatureImportéeEventPayload
>;

export type ImporterCandidatureBehaviorCommonOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.ValueType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
};

type ImporterCandidatureBehaviorOptions = ImporterCandidatureBehaviorCommonOptions & {
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
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
    throw new AppelOffreInexistantError(candidature.identifiantProjet.appelOffre);
  }

  const période = this.récupererPériodeAO(appelOffre, candidature.identifiantProjet.période);
  const famille = this.récupererFamilleAO(
    appelOffre,
    candidature.identifiantProjet.période,
    candidature.identifiantProjet.famille,
  );

  if (période.type === 'legacy') {
    throw new PériodeAppelOffreLegacyError(
      candidature.identifiantProjet.appelOffre,
      candidature.identifiantProjet.période,
    );
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
    candidature.statut.estClassé() &&
    candidature.typeGarantiesFinancières &&
    candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    !candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
  }

  if (
    candidature.statut.estClassé() &&
    candidature.typeGarantiesFinancières &&
    !candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceNonAttendueError();
  }

  const event: CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V1',
    payload: {
      ...mapToEventPayload(candidature),
      importéLe: candidature.importéLe.formatter(),
      importéPar: candidature.importéPar.formatter(),
    },
  };
  await this.publish(event);
}

export function applyCandidatureImportée(
  this: CandidatureAggregate,
  { payload }: CandidatureImportéeEvent,
) {
  this.importé = true;
  this.statut = StatutCandidature.convertirEnValueType(payload.statut);
  this.garantiesFinancières = payload.typeGarantiesFinancières
    ? {
        type: TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancières),
        dateEchéance:
          payload.dateÉchéanceGf && DateTime.convertirEnValueType(payload.dateÉchéanceGf),
      }
    : undefined;
  this.payloadHash = this.calculerHash(payload);
  this.nomReprésentantLégal = payload.nomReprésentantLégal;
  this.sociétéMère = payload.sociétéMère;
  this.typeActionnariat = payload.actionnariat
    ? TypeActionnariat.convertirEnValueType(payload.actionnariat)
    : undefined;
}

export const mapToEventPayload = (candidature: ImporterCandidatureBehaviorCommonOptions) => ({
  identifiantProjet: candidature.identifiantProjet.formatter(),
  statut: candidature.statut.statut,
  technologie: candidature.technologie.type,
  dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),
  historiqueAbandon: candidature.historiqueAbandon.formatter(),
  typeGarantiesFinancières: candidature.typeGarantiesFinancières?.type,
  nomProjet: candidature.nomProjet,
  sociétéMère: candidature.sociétéMère,
  nomCandidat: candidature.nomCandidat,
  puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
  prixReference: candidature.prixReference,
  noteTotale: candidature.noteTotale,
  nomReprésentantLégal: candidature.nomReprésentantLégal,
  emailContact: candidature.emailContact.formatter(),
  localité: candidature.localité,
  motifÉlimination: candidature.motifÉlimination,
  puissanceALaPointe: candidature.puissanceALaPointe,
  evaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
  actionnariat: candidature.actionnariat?.formatter(),
  territoireProjet: candidature.territoireProjet,
});
