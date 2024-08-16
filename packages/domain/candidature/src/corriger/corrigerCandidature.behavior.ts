import { createHash } from 'node:crypto';

import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import { GarantiesFinancièresRequisesPourAppelOffreError } from '../garantiesFinancièresRequises.error';
import {
  AppelOffreInexistantError,
  FamillePériodeAppelOffreInexistanteError,
  PériodeAppelOffreInexistanteError,
} from '../appelOffreInexistant.error';
import { CandidatureNonModifiéeError } from '../candidatureNonModifiée.error';
import {
  CandidatureImportéePayload,
  ImporterCandidatureOptions,
} from '../importer/importerCandidature.behavior';

type CandidatureCorrigéePayload = CandidatureImportéePayload;

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V1',
  CandidatureCorrigéePayload
>;

type CorrigerCandidatureOptions = ImporterCandidatureOptions;

export async function corriger(
  this: CandidatureAggregate,
  candidature: CorrigerCandidatureOptions,
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) {
  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(candidature.appelOffre);
  }

  const période = appelOffre.periodes.find((x) => x.id === candidature.période);
  if (!période) {
    throw new PériodeAppelOffreInexistanteError(candidature.appelOffre, candidature.période);
  }

  let famille: AppelOffre.Famille | undefined;
  if (candidature.famille) {
    famille = période.familles.find((x) => x.id === candidature.famille);
    if (!famille) {
      throw new FamillePériodeAppelOffreInexistanteError(
        candidature.appelOffre,
        candidature.période,
        candidature.famille,
      );
    }
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

  const event: CandidatureCorrigéeEvent = {
    type: 'CandidatureCorrigée-V1',
    payload: {
      identifiantProjet: candidature.identifiantProjet.formatter(),
      statut: candidature.statut.statut,
      technologie: candidature.technologie.type,
      dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),
      historiqueAbandon: candidature.historiqueAbandon?.formatter(),
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
    },
  };
  if (this.payloadHash === computePayloadHash(event.payload)) {
    throw new CandidatureNonModifiéeError(candidature.nomProjet);
  }
  await this.publish(event);
}

export function applyCandidatureCorrigée(
  this: CandidatureAggregate,
  { payload }: CandidatureCorrigéeEvent,
) {
  this.importé = true;
  this.statut = StatutCandidature.convertirEnValueType(payload.statut);
  this.payloadHash = computePayloadHash(payload);
}

const computePayloadHash = (payload: CandidatureCorrigéeEvent['payload']) =>
  createHash('md5')
    .update(JSON.stringify(payload, Object.keys(payload).sort()))
    .digest('hex');
