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

export type AbandonEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type ExecuteAbandonProjector = Message<
  'EXECUTE_ABANDON_PROJECTOR',
  Abandon.AbandonEvent | RebuildTriggered
>;

export const registerAbandonProjector = () => {
  const handler: MessageHandler<ExecuteAbandonProjector> = async ({ type, payload }) => {
    if (type === 'RebuildTriggered') {
      await removeProjection<AbandonProjection>(`abandon|${payload.id}`);
    } else {
      const { identifiantProjet } = payload;

      const abandon = await findProjection<AbandonProjection>(`abandon|${identifiantProjet}`);

      const abandonToUpsert: Omit<AbandonProjection, 'type'> = isSome(abandon)
        ? abandon
        : {
            identifiantProjet,
            nomProjet: '',
            demandeDemandéLe: '',
            demandeDemandéPar: '',
            demandePièceJustificativeFormat: '',
            demandeRaison: '',
            demandeRecandidature: false,
            statut: 'demandé',
          };

      switch (type) {
        case 'AbandonDemandé-V1':
          const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

          if (isNone(projet)) {
            getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet });
          }

          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeDemandéPar: payload.demandéPar,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
          });
          break;
        case 'AbandonAccordé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            accordAccordéLe: payload.accordéLe,
            accordAccordéPar: payload.accordéPar,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
          });
          break;
        case 'AbandonRejeté-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRejetéPar: payload.rejetéPar,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'rejeté',
          });
          break;
        case 'ConfirmationAbandonDemandée-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationDemandéeLe: payload.confirmationDemandéeLe,
            confirmationDemandéePar: payload.confirmationDemandéePar,
            confirmationDemandéeRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'confirmation-demandée',
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationConfirméLe: payload.confirméLe,
            confirmationConfirméPar: payload.confirméPar,
            statut: 'confirmé',
          });
          break;
        case 'AbandonAnnulé-V1':
          await removeProjection(`abandon|${payload.identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJECTOR', handler);
};
