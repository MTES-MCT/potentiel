import { Message, MessageHandler, mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';
import { updateProjection } from '../../infrastructure/updateProjection';

export type SubscriptionEvent = (Candidature.CandidatureEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
    } else {
      switch (type) {
        case 'CandidatureImportée-V1':
        case 'CandidatureCorrigée-V1':
          const identifiantProjet = IdentifiantProjet.convertirEnValueType(
            payload.identifiantProjet,
          );

          const candidature = await findProjection<Candidature.CandidatureEntity>(
            `candidature|${identifiantProjet.formatter()}`,
          );

          const notification = Option.isSome(candidature)
            ? type === 'CandidatureCorrigée-V1' &&
              payload.doitRégénérerAttestation &&
              candidature.notification
              ? {
                  ...candidature.notification,
                  attestationGénéréeLe: candidature.notification.attestationGénéréeLe
                    ? payload.corrigéLe
                    : undefined,
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
              ? Candidature.TypeGarantiesFinancières.convertirEnValueType(
                  payload.typeGarantiesFinancières,
                ).type
              : undefined,
            historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
              payload.historiqueAbandon,
            ).type,
            dateÉchéanceGf: payload.dateÉchéanceGf
              ? DateTime.convertirEnValueType(payload.dateÉchéanceGf).formatter()
              : undefined,
            technologie: Candidature.TypeTechnologie.convertirEnValueType(payload.technologie).type,
            estNotifiée: Option.isSome(candidature) ? candidature.estNotifiée : false,
            notification,
            misÀJourLe: type === 'CandidatureCorrigée-V1' ? payload.corrigéLe : payload.importéLe,
            détailsMisÀJourLe:
              type === 'CandidatureImportée-V1'
                ? payload.importéLe
                : payload.détailsMisÀJour
                  ? payload.corrigéLe
                  : Option.isSome(candidature)
                    ? candidature.détailsMisÀJourLe
                    : // ce cas est théoriquement impossible,
                      // on ne peut pas avoir de correction sur une candidature non importée
                      payload.corrigéLe,
          };

          await upsertProjection<Candidature.CandidatureEntity>(
            `candidature|${payload.identifiantProjet}`,
            candidatureToUpsert,
          );
          break;
        case 'CandidatureNotifiée-V1':
          await updateProjection<Candidature.CandidatureEntity>(
            `candidature|${payload.identifiantProjet}`,
            {
              estNotifiée: true,
              notification: {
                notifiéeLe: payload.notifiéeLe,
                notifiéePar: payload.notifiéePar,
                validateur: payload.validateur,
                attestationGénéréeLe: event.payload.attestation ? payload.notifiéeLe : undefined,
              },
            },
          );
      }
    }
  };

  mediator.register('System.Projector.Candidature', handler);
};
