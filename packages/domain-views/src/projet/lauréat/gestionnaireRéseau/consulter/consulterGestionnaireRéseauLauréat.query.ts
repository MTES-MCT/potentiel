import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain-usecases';

import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel/core-domain-views';
import { Option, isSome, none } from '@potentiel/monads';
import {
  GestionnaireRéseauLauréatLegacyReadModel,
  GestionnaireRéseauLauréatReadModel,
} from '../gestionnaireRéseauLauréat.readmodel';

export type ConsulterGestionnaireRéseauLauréatQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<GestionnaireRéseauLauréatReadModel>
>;

export type ConsulterGestionnaireRéseauLauréatDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauLauréatQuery = ({
  find,
}: ConsulterGestionnaireRéseauLauréatDependencies) => {
  const queryHandler: MessageHandler<ConsulterGestionnaireRéseauLauréatQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const result = await find<GestionnaireRéseauLauréatLegacyReadModel>(
      `projet|${identifiantProjetValueType.formatter()}`,
    );

    return isSome(result)
      ? {
          type: 'gestion-réseau-lauréat',
          identifiantGestionnaire: result.identifiantGestionnaire,
        }
      : none;
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY', queryHandler);
};
