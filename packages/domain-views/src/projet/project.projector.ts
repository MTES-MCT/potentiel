import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjetEvent } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { ProjetReadModel, ProjetReadModelKey } from './projet.readModel';
import { Create, Update, Find, RebuildTriggered, Remove } from '@potentiel/core-domain-views';

export type ExecuteProjetProjector = Message<
  'EXECUTE_PROJET_PROJECTOR',
  ProjetEvent | RebuildTriggered
>;

export type ProjetProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
  remove: Remove;
};

export const registerProjetProjector = ({
  create,
  update,
  find,
  remove,
}: ProjetProjectorDependencies) => {
  const handler: MessageHandler<ExecuteProjetProjector> = async (event) => {
    if (event.type === 'RebuildTriggered') {
      await remove<ProjetReadModel>(`projet|${event.payload.id}`);
    } else {
      const key: ProjetReadModelKey = `projet|${
        event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
      }`;
      switch (event.type) {
        case 'GestionnaireRéseauProjetDéclaré':
          await create<Pick<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>(key, {
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
          break;
        case 'GestionnaireRéseauProjetModifié':
          const projet = await find<ProjetReadModel>(key);

          if (isNone(projet)) {
            await create<Pick<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>(key, {
              identifiantGestionnaire: {
                codeEIC: event.payload.identifiantGestionnaireRéseau,
              },
            });
          } else {
            await update<Pick<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>(key, {
              identifiantGestionnaire: {
                codeEIC: event.payload.identifiantGestionnaireRéseau,
              },
            });
          }
          break;
      }
    }
  };

  mediator.register('EXECUTE_PROJET_PROJECTOR', handler);
};
