import { Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import { createProjetAggregateId } from '../../projet/projet.aggregate';
import { Message, MessageHandler, mediator } from 'mediateur';

const MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET = Symbol('MOIDIFIER_GESTIONNAIRE_RÉSEAU_PROJET');

export type ModifierGestionnaireRéseauProjetCommand = Message<
  typeof MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET,
  {
    identifiantGestionnaireRéseau: string;
    identifiantProjet: IdentifiantProjet;
  }
>;

type ModifierGestionnaireRéseauProjetDependencies = { publish: Publish };

export const registerModifierGestionnaireRéseauProjetCommand = ({
  publish,
}: ModifierGestionnaireRéseauProjetDependencies) => {
  const handler: MessageHandler<ModifierGestionnaireRéseauProjetCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const event: GestionnaireRéseauProjetModifiéEvent = {
      type: 'GestionnaireRéseauProjetModifié',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau,
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register(MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET, handler);
};

export const createModifierGestionnaireRéseauProjetCommand = (
  commandData: ModifierGestionnaireRéseauProjetCommand['data'],
): ModifierGestionnaireRéseauProjetCommand => ({
  type: MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET,
  data: { ...commandData },
});
