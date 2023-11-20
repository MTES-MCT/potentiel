import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone, isSome } from '@potentiel/monads';
import { Abandon } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { AbandonProjection } from '@potentiel-domain/laureat/src/abandon/abandon.projection';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';
import { getLogger } from '@potentiel/monitoring';
import { DateTime } from '@potentiel-domain/common';

export type SubscriptionEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_ABANDON_PROJECTOR', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<AbandonProjection>(`abandon|${payload.id}`);
      await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
        `abandon-avec-recandidature-sans-preuve|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const abandon = await findProjection<AbandonProjection>(`abandon|${identifiantProjet}`);

      const abandonToUpsert: Omit<AbandonProjection, 'type'> = isSome(abandon)
        ? { ...abandon }
        : {
            identifiantProjet,
            nomProjet: '',
            appelOffre: '',
            période: '',
            famille: undefined,
            demandeDemandéLe: '',
            demandeDemandéPar: '',
            demandePièceJustificativeFormat: '',
            demandeRaison: '',
            demandeRecandidature: false,
            statut: 'demandé',
            misÀJourLe: DateTime.now().formatter(),
          };

      switch (type) {
        case 'AbandonDemandé-V1':
          const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

          if (isNone(projet)) {
            getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
          }

          await upsertProjection<AbandonProjection>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
            appelOffre: isSome(projet) ? projet.appelOffre : `N/A`,
            période: isSome(projet) ? projet.période : `N/A`,
            famille: isSome(projet) ? projet.famille : undefined,
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeDemandéPar: payload.demandéPar,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
            misÀJourLe: payload.demandéLe,
          });
          break;
        case 'AbandonAccordé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            accordAccordéLe: payload.accordéLe,
            accordAccordéPar: payload.accordéPar,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
            misÀJourLe: payload.accordéLe,
          });
          break;
        case 'AbandonRejeté-V1':
          await upsertProjection<AbandonProjection>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRejetéPar: payload.rejetéPar,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'rejeté',
            misÀJourLe: payload.rejetéLe,
          });
          break;
        case 'ConfirmationAbandonDemandée-V1':
          await upsertProjection<AbandonProjection>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationDemandéeLe: payload.confirmationDemandéeLe,
            confirmationDemandéePar: payload.confirmationDemandéePar,
            confirmationDemandéeRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'confirmation-demandée',
            misÀJourLe: payload.confirmationDemandéeLe,
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationConfirméLe: payload.confirméLe,
            confirmationConfirméPar: payload.confirméPar,
            statut: 'confirmé',
            misÀJourLe: payload.confirméLe,
          });
          break;
        case 'PreuveRecandidatureTransmise-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            preuveRecandidature: payload.preuveRecandidature,
          });
          await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
          );
          break;
        case 'PreuveRecandidatureDemandée-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            preuveRecandidatureDemandéeLe: payload.demandéeLe,
          });
          await upsertProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
            payload,
          );
          break;
        case 'AbandonAnnulé-V1':
          await removeProjection(`abandon|${identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJECTOR', handler);
};
