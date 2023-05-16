import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { GestionnaireNonRéférencéError } from './gestionnaireNonRéférencé.error';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

const CONSULTER_GESTIONNAIRE_RÉSEAU = Symbol('CONSULTER_GESTIONNAIRE_RÉSEAU');

export type ConsulterGestionnaireRéseauQuery = Message<
  typeof CONSULTER_GESTIONNAIRE_RÉSEAU,
  {
    codeEIC: string;
  },
  GestionnaireRéseauReadModel
>;

type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauDependencies) => {
  const queryHandler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({ codeEIC }) => {
    const result = await find<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${codeEIC}`);

    if (isNone(result)) {
      throw new GestionnaireNonRéférencéError();
    }

    return result;
  };

  mediator.register(CONSULTER_GESTIONNAIRE_RÉSEAU, queryHandler);
};

export const buildConsulterGestionnaireRéseauQuery =
  getMessageBuilder<ConsulterGestionnaireRéseauQuery>(CONSULTER_GESTIONNAIRE_RÉSEAU);
