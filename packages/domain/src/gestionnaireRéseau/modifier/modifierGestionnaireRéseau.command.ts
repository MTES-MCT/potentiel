import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifié.event';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';
import { Message, MessageHandler, mediator } from 'mediateur';

const MODIFIER_GESTIONNAIRE_RÉSEAU = Symbol('MODIFIER_GESTIONNAIRE_RÉSEAU');

type ModifierGestionnaireRéseauCommand = Message<
  typeof MODIFIER_GESTIONNAIRE_RÉSEAU,
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }
>;

type ModifierGestionnaireRéseauDependencies = { publish: Publish; loadAggregate: LoadAggregate };

export const registerModifierGestionnaireRéseauCommand = ({
  publish,
  loadAggregate,
}: ModifierGestionnaireRéseauDependencies) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  const commandHandler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };

  mediator.register(MODIFIER_GESTIONNAIRE_RÉSEAU, commandHandler);
};

export const createModifierGestionnaireRéseauCommand = (
  commandData: ModifierGestionnaireRéseauCommand['data'],
): ModifierGestionnaireRéseauCommand => ({
  type: MODIFIER_GESTIONNAIRE_RÉSEAU,
  data: { ...commandData },
});
