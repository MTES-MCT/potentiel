import { Find, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  registerAjouterGestionnaireRéseauCommand,
  registerConsulterGestionnaireRéseauQuery,
  registerModifierGestionnaireRéseauCommand,
} from './gestionnaireRéseau';

type MessageHandlerPorts = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  find: Find;
};

export const setupMessageHandlers = async ({
  publish,
  loadAggregate,
  find,
}: MessageHandlerPorts) => {
  registerCommands(publish, loadAggregate);
  registerQueries(find);
};

const registerCommands = (publish: Publish, loadAggregate: LoadAggregate) => {
  registerAjouterGestionnaireRéseauCommand({
    publish,
    loadAggregate,
  });

  registerModifierGestionnaireRéseauCommand({
    publish,
    loadAggregate,
  });
};

const registerQueries = (find: Find) => {
  registerConsulterGestionnaireRéseauQuery({ find });
};
