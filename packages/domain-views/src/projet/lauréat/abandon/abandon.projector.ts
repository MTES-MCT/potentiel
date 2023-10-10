import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonEvent } from '@potentiel/domain';
import { Find, RebuildTriggered, Remove, Upsert } from '@potentiel/core-domain-views';
import { AbandonReadModel } from './abandon.readmodel';
import { isSome } from '@potentiel/monads';

export type ExecuteAbandonProjector = Message<
  'EXECUTE_ABANDON_PROJECTOR',
  AbandonEvent | RebuildTriggered
>;

export type AbandonProjectorDependencies = {
  upsert: Upsert;
  find: Find;
  remove: Remove;
};

export const registerAbandonProjector = ({
  upsert,
  find,
  remove,
}: AbandonProjectorDependencies) => {
  const handler: MessageHandler<ExecuteAbandonProjector> = async ({ type, payload }) => {
    if (type === 'RebuildTriggered') {
      await remove<AbandonReadModel>(`abandon|${payload.id}`);
    } else {
      const abandon = await find<AbandonReadModel>(`abandon|${payload.identifiantProjet}`);

      const abandonToUpsert: Omit<AbandonReadModel, 'type'> = isSome(abandon)
        ? abandon
        : {
            identifiantDemande: `abandon|${payload.identifiantProjet}`,
            identifiantProjet: payload.identifiantProjet,

            demandeDemandéLe: '',
            demandePièceJustificativeFormat: '',
            demandeRaison: '',
            demandeRecandidature: false,
            statut: 'demandé',
          };

      switch (type) {
        case 'AbandonDemandé-V1':
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            demandePièceJustificativeFormat:
              payload.pièceJustificative && payload.pièceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
          });
          break;
        case 'AbandonAccordé-V1':
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            accordAccordéLe: payload.acceptéLe,
            accordRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'accordé',
          });
          break;
        case 'AbandonRejeté-V1':
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            rejetRejetéLe: payload.rejetéLe,
            rejetRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'rejeté',
          });
          break;
        case 'ConfirmationAbandonDemandée-V1':
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationDemandéeLe: payload.confirmationDemandéeLe,
            confirmationDemandéeRéponseSignéeFormat: payload.réponseSignée.format,
            statut: 'confirmation-demandée',
          });
          break;
        case 'AbandonConfirmé-V1':
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            ...abandonToUpsert,
            confirmationConfirméLe: payload.confirméLe,
            statut: 'confirmé',
          });
          break;
        case 'AbandonAnnulé-V1':
          await remove(`abandon|${payload.identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJECTOR', handler);
};
