import { Candidature } from '@potentiel-domain/projet';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureCorrigéeV1Projector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );

  const notification: Candidature.CandidatureEntity['notification'] = Option.isSome(candidature)
    ? payload.doitRégénérerAttestation && candidature.notification
      ? {
          ...candidature.notification,
          attestation: candidature.notification.attestation && {
            généréeLe: payload.corrigéLe,
            format: candidature.notification.attestation.format,
          },
        }
      : candidature.notification
    : undefined;

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
    coefficientKChoisi: payload.coefficientKChoisi,
    estNotifiée: Option.isSome(candidature) ? candidature.estNotifiée : false,
    notification,
    misÀJourLe: payload.corrigéLe,
    détailsMisÀJourLe: payload.détailsMisÀJour
      ? payload.corrigéLe
      : Option.isSome(candidature)
        ? candidature.détailsMisÀJourLe
        : // ce cas est théoriquement impossible,
          // on ne peut pas avoir de correction sur une candidature non importée
          payload.corrigéLe,
    fournisseurs: Option.isSome(candidature) ? candidature.fournisseurs : [],
  };

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
