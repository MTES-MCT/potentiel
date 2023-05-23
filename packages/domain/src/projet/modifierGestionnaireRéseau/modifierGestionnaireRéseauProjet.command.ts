import { Publish } from '@potentiel/core-domain';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import { createProjetAggregateId } from '../projet.aggregate';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet, formatIdentifiantProjet } from '../identifiantProjet';

export type ModifierGestionnaireRéseauProjetCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: string;
    identifiantProjet: IdentifiantProjet;
  }
>;

export type ModifierGestionnaireRéseauProjetDependencies = { publish: Publish };

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

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};

export const buildModifierGestionnaireRéseauProjetCommand =
  getMessageBuilder<ModifierGestionnaireRéseauProjetCommand>('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET');
