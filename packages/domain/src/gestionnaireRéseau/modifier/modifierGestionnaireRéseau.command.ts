import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifié.event';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../identifiantGestionnaireRéseau';

export type ModifierGestionnaireRéseauCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
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
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(
      formatIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau),
    );

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        codeEIC: formatIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(
      createGestionnaireRéseauAggregateId(
        formatIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau),
      ),
      event,
    );
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU', commandHandler);
};

export const buildModifierGestionnaireRéseauCommand =
  getMessageBuilder<ModifierGestionnaireRéseauCommand>('MODIFIER_GESTIONNAIRE_RÉSEAU');
