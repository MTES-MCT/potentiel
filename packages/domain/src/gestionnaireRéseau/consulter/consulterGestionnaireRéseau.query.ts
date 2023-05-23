import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { GestionnaireNonRéférencéError } from './gestionnaireNonRéférencé.error';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../identifiantGestionnaireRéseau';

export type ConsulterGestionnaireRéseauQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
  },
  GestionnaireRéseauReadModel
>;

export type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauDependencies) => {
  const queryHandler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const result = await find<GestionnaireRéseauReadModel>(
      `gestionnaire-réseau#${formatIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)}`,
    );

    if (isNone(result)) {
      throw new GestionnaireNonRéférencéError();
    }

    return result;
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU', queryHandler);
};

export const buildConsulterGestionnaireRéseauQuery =
  getMessageBuilder<ConsulterGestionnaireRéseauQuery>('CONSULTER_GESTIONNAIRE_RÉSEAU');
