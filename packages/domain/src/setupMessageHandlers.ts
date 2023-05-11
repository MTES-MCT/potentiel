import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  registerAjouterGestionnaireRéseauCommand,
  registerModifierGestionnaireRéseauCommand,
} from './gestionnaireRéseau';

type MessageHandlerPorts = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const setupMessageHandlers = async ({ publish, loadAggregate }: MessageHandlerPorts) => {
  registerAjouterGestionnaireRéseauCommand({
    publish,
    loadAggregate,
  });

  registerModifierGestionnaireRéseauCommand({
    publish,
    loadAggregate,
  });
};
