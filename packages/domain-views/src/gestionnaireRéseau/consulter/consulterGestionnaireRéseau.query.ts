import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel/monads';
import {
  GestionnaireRéseauReadModel,
  GestionnaireRéseauReadModelKey,
} from '../gestionnaireRéseau.readModel';
import { Find } from '../../common.port';
import {
  IdentifiantGestionnaireRéseau,
  RawIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantGestionnaireRéseau,
  estUnIdentifiantGestionnaireRéseau,
} from '@potentiel/domain';

export type ConsulterGestionnaireRéseauQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {
    identifiantGestionnaireRéseau: RawIdentifiantGestionnaireRéseau | IdentifiantGestionnaireRéseau;
  },
  Option<GestionnaireRéseauReadModel>
>;

export type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const rawIdentifiantGestionnaireRéseau = estUnIdentifiantGestionnaireRéseau(
      identifiantGestionnaireRéseau,
    )
      ? convertirEnIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau).formatter()
      : identifiantGestionnaireRéseau;
    const key: GestionnaireRéseauReadModelKey = `gestionnaire-réseau|${rawIdentifiantGestionnaireRéseau}`;
    const result = await find<GestionnaireRéseauReadModel>(key);

    return result;
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY', handler);
};
