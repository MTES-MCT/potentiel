import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauDéjàExistantError } from '../gestionnaireRéseau.error';
import { GestionnaireRéseauAjoutéEventV1 } from '../gestionnaireRéseau.event';
import { IdentifiantGestionnaireRéseauValueType } from '../gestionnaireRéseau.valueType';

export type AjouterGestionnaireRéseauCommand = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type AjouterGestionnaireRéseauDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAjouterGestionnaireRéseauCommand = ({
  publish,
  loadAggregate,
}: AjouterGestionnaireRéseauDependencies) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  const commandHandler: MessageHandler<AjouterGestionnaireRéseauCommand> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(identifiantGestionnaireRéseau);

    if (isSome(gestionnaireRéseau)) {
      throw new GestionnaireRéseauDéjàExistantError();
    }

    const event: GestionnaireRéseauAjoutéEventV1 = {
      type: 'GestionnaireRéseauAjouté-V1',
      payload: {
        codeEIC: identifiantGestionnaireRéseau.formatter(),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(identifiantGestionnaireRéseau), event);
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND', commandHandler);
};
