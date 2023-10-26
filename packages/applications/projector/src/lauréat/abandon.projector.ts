import { Message, MessageHandler, mediator } from 'mediateur';

import { isSome } from '@potentiel/monads';
import { Abandon } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  removeProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projections';
import { AbandonProjection } from '@potentiel-domain/laureat/src/abandon/abandon.projection';

export type ExecuteAbandonProjector = Message<
  'EXECUTE_ABANDON_PROJECTOR',
  Abandon.AbandonEvent | RebuildTriggered
>;

export const registerAbandonProjector = () => {
  const handler: MessageHandler<ExecuteAbandonProjector> = async ({ type, payload }) => {
    if (type === 'RebuildTriggered') {
      await removeProjection<AbandonProjection>(`abandon|${payload.id}`);
    } else {
      const abandon = await findProjection<AbandonProjection>(
        `abandon|${payload.identifiantProjet}`,
      );

      const abandonToUpsert: Omit<AbandonProjection, 'type'> = isSome(abandon)
        ? abandon
        : {
            identifiantProjet: payload.identifiantProjet,
            demandeDemandéLe: '',
            demandeDemandéPar: '',
            demandePièceJustificativeFormat: '',
            demandeRaison: '',
            demandeRecandidature: false,
            statut: 'demandé',
          };

      switch (type) {
        case 'AbandonDemandé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
          });
          break;
        case 'AbandonAccordé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            accordAccordéLe: payload.accordéLe,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
          });
          break;
        case 'AbandonRejeté-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'rejeté',
          });
          break;
        case 'ConfirmationAbandonDemandée-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationDemandéeLe: payload.confirmationDemandéeLe,
            confirmationDemandéeRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'confirmation-demandée',
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsertProjection<AbandonProjection>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationConfirméLe: payload.confirméLe,
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
