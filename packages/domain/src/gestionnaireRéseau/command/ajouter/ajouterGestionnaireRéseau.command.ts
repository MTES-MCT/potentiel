import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { GestionnaireRéseauAjoutéEvent } from './gestionnaireRéseauAjouté.event';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error';
import {
  loadGestionnaireRéseauAggregateFactory,
  createGestionnaireRéseauAggregateId,
} from '../../aggregate/gestionnaireRéseau.aggregate';

export type AjouterGestionnaireRéseauCommand = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
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
    codeEIC,
    raisonSociale,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    if (isSome(gestionnaireRéseau)) {
      throw new GestionnaireRéseauDéjàExistantError();
    }

    const event: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND', commandHandler);
};

export const buildAjouterGestionnaireRéseauCommand =
  getMessageBuilder<AjouterGestionnaireRéseauCommand>('AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND');
