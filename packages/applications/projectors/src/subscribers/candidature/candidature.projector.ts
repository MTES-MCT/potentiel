import { Message, MessageHandler, mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Candidature.CandidatureEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
    } else {
      const {
        identifiantProjet,
        statut,
        typeGarantiesFinancières,
        historiqueAbandon,
        dateÉchéanceGf,
        technologie,
      } = payload;

      const candidatureDefaultValue: Omit<Candidature.CandidatureEntity, 'type'> = {
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
        valeurÉvaluationCarbone: payload.valeurÉvaluationCarbone,
        financementCollectif: payload.financementCollectif,
        financementParticipatif: payload.financementParticipatif,
        gouvernancePartagée: payload.gouvernancePartagée,
        territoireProjet: payload.territoireProjet,
        identifiantProjet,
        statut: StatutProjet.convertirEnValueType(statut).statut,
        typeGarantiesFinancières: typeGarantiesFinancières
          ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
              typeGarantiesFinancières,
            ).type
          : undefined,
        historiqueAbandon:
          Candidature.HistoriqueAbandon.convertirEnValueType(historiqueAbandon).type,
        dateÉchéanceGf: dateÉchéanceGf
          ? DateTime.convertirEnValueType(dateÉchéanceGf).formatter()
          : undefined,
        technologie: Candidature.Technologie.convertirEnValueType(technologie).type,
        misÀJourLe: type === 'CandidatureCorrigée-V1' ? payload.corrigéLe : payload.importéLe,
      };

      switch (type) {
        case 'CandidatureImportée-V1':
        case 'CandidatureCorrigée-V1':
          await upsertProjection<Candidature.CandidatureEntity>(
            `candidature|${identifiantProjet}`,
            candidatureDefaultValue,
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Candidature', handler);
};
