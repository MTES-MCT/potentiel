import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureImportéeProjector = async ({
  payload,
}: Candidature.CandidatureImportéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidatureToUpsert: Omit<Candidature.CandidatureEntity, 'type'> = {
    identifiantProjet: payload.identifiantProjet,
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
    nomProjet: payload.nomProjet,
    sociétéMère: payload.sociétéMère,
    nomCandidat: payload.nomCandidat,
    puissanceProductionAnnuelle: payload.puissanceProductionAnnuelle,
    prixReference: payload.prixReference,
    noteTotale: payload.noteTotale,
    nomReprésentantLégal: payload.nomReprésentantLégal,
    emailContact: payload.emailContact,
    localité: payload.localité,
    motifÉlimination: payload.motifÉlimination,
    puissanceALaPointe: payload.puissanceALaPointe,
    evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiée,
    actionnariat: payload.actionnariat,
    territoireProjet: payload.territoireProjet,
    statut: Candidature.StatutCandidature.convertirEnValueType(payload.statut).statut,
    typeGarantiesFinancières: payload.typeGarantiesFinancières
      ? Candidature.TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancières)
          .type
      : undefined,
    historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(payload.historiqueAbandon)
      .type,
    dateÉchéanceGf: payload.dateÉchéanceGf
      ? DateTime.convertirEnValueType(payload.dateÉchéanceGf).formatter()
      : undefined,
    technologie: Candidature.TypeTechnologie.convertirEnValueType(payload.technologie).type,
    estNotifiée: false,
    notification: undefined,
    misÀJourLe: payload.importéLe,
    détailsMisÀJourLe: payload.importéLe,
  };

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
