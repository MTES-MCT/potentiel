import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonEvent, convertirEnIdentifiantProjet } from '@potentiel/domain';
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

export const registerAbandonProjector = ({ upsert, remove }: AbandonProjectorDependencies) => {
  const handler: MessageHandler<ExecuteAbandonProjector> = async ({ type, payload }) => {
    if (type === 'RebuildTriggered') {
      await remove<AbandonReadModel>(`abandon|${payload.id}`);
    } else {
      switch (type) {
        case 'AbandonDemandé-V1':
          const { appelOffre, famille, numéroCRE, période } = convertirEnIdentifiantProjet(
            payload.identifiantProjet as `${string}#${string}#${string}#${string}`,
          );
          await upsert<AbandonReadModel>(`abandon|${payload.identifiantProjet}`, {
            appelOffre,
            demandePiéceJustificativeFormat: payload.piéceJustificative.format,
            demandeDemandéLe: payload.demandéLe,
            demandeRaison: payload.raison,
            demandeRecandidature: payload.recandidature,
            numéroCRE,
            période,
            famille: isSome(famille) ? famille : '',
            status: 'demandé',
          });
          break;
      }
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJECTOR', handler);
};
