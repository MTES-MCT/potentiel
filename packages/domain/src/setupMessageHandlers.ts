import { Find, List, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  registerAjouterGestionnaireRéseauCommand,
  registerConsulterGestionnaireRéseauQuery,
  registerListerGestionnaireRéseauQuery,
  registerModifierGestionnaireRéseauCommand,
} from './gestionnaireRéseau';

type MessageHandlerPorts = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  find: Find;
  list: List;
};

export const setupMessageHandlers = async ({
  publish,
  loadAggregate,
  find,
  list,
}: MessageHandlerPorts) => {
  registerCommands(publish, loadAggregate);
  registerQueries(find, list);
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

const registerQueries = (find: Find, list: List) => {
  registerConsulterGestionnaireRéseauQuery({ find });
  registerListerGestionnaireRéseauQuery({ list });
};
