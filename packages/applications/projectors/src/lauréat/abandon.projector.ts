import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Abandon } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime } from '@potentiel-domain/common';

export type SubscriptionEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Abandon', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Abandon.AbandonEntity>(`abandon|${payload.id}`);
      await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
        `abandon-avec-recandidature-sans-preuve|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      const abandon = await findProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);

      const abandonDefaultValue: Omit<Abandon.AbandonEntity, 'type'> = {
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
        preuveRecandidatureStatut: 'non-applicable',
        statut: 'demandé',
        misÀJourLe: DateTime.now().formatter(),
        régionProjet: [],
      };

      const abandonToUpsert: Omit<Abandon.AbandonEntity, 'type'> = Option.isSome(abandon)
        ? abandon
        : abandonDefaultValue;

      switch (type) {
        case 'AbandonDemandé-V1':
          const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

          if (Option.isNone(projet)) {
            getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
          }

          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonDefaultValue,
            nomProjet: Option.isSome(projet) ? projet.nom : 'Projet inconnu',
            appelOffre: Option.isSome(projet) ? projet.appelOffre : `N/A`,
            période: Option.isSome(projet) ? projet.période : `N/A`,
            famille: Option.isSome(projet) ? projet.famille : undefined,
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeDemandéPar: payload.demandéPar,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
            statut: 'demandé',
            misÀJourLe: payload.demandéLe,
            régionProjet: Option.isSome(projet) ? [...projet.localité.région.split(' / ')] : [],
          });
          break;
        case 'AbandonAccordé-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            accordAccordéLe: payload.accordéLe,
            accordAccordéPar: payload.accordéPar,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
            misÀJourLe: payload.accordéLe,
          });
          break;
        case 'AbandonRejeté-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRejetéPar: payload.rejetéPar,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'rejeté',
            misÀJourLe: payload.rejetéLe,
          });
          break;
        case 'ConfirmationAbandonDemandée-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationDemandéeLe: payload.confirmationDemandéeLe,
            confirmationDemandéePar: payload.confirmationDemandéePar,
            confirmationDemandéeRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'confirmation-demandée',
            misÀJourLe: payload.confirmationDemandéeLe,
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationConfirméLe: payload.confirméLe,
            confirmationConfirméPar: payload.confirméPar,
            statut: 'confirmé',
            misÀJourLe: payload.confirméLe,
          });
          break;
        case 'PreuveRecandidatureTransmise-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            preuveRecandidature: payload.preuveRecandidature,
            preuveRecandidatureStatut: 'transmise',
            preuveRecandidatureTransmiseLe: payload.transmiseLe,
            preuveRecandidatureTransmisePar: payload.transmisePar,
          });
          await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
          );
          break;
        case 'PreuveRecandidatureDemandée-V1':
          await upsertProjection<Abandon.AbandonEntity>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            preuveRecandidatureDemandéeLe: payload.demandéeLe,
            preuveRecandidatureStatut: 'en-attente',
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

  mediator.register('System.Projector.Lauréat.Abandon', handler);
};
