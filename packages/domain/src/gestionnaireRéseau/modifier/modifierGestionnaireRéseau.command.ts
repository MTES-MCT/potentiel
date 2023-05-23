import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifié.event';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

export type ModifierGestionnaireRéseauCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }
>;

export type ModifierGestionnaireRéseauDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

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

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU', commandHandler);
};

export const buildModifierGestionnaireRéseauCommand =
  getMessageBuilder<ModifierGestionnaireRéseauCommand>('MODIFIER_GESTIONNAIRE_RÉSEAU');
