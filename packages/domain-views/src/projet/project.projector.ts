import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjetEvent } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { ProjetReadModel, ProjetReadModelKey } from './projet.readModel';
import { Create, Update, Find } from '../domainViews.port';

export type ExecuteProjetProjector = Message<'EXECUTE_PROJET_PROJECTOR', ProjetEvent>;

export type ProjetProjectorDependencies = {
  create: Create;
  update: Update;
  find: Find;
};

export const registerProjetProjector = ({ create, update, find }: ProjetProjectorDependencies) => {
  const handler: MessageHandler<ExecuteProjetProjector> = async (event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetModifié':
        const key: ProjetReadModelKey = `projet#${
          event.payload.identifiantProjet as `${string}#${string}#${string}#${string}`
        }`;
        const projet = await find<ProjetReadModel>(key);

        if (isNone(projet)) {
          await create<ProjetReadModel>(key, {
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        } else {
          await update<ProjetReadModel>(key, {
            identifiantGestionnaire: {
              codeEIC: event.payload.identifiantGestionnaireRéseau,
            },
          });
        }
        break;
    }
  };

  mediator.register('EXECUTE_PROJET_PROJECTOR', handler);
};
