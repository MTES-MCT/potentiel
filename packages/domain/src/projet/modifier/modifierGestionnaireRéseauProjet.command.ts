import { Publish } from '@potentiel/core-domain';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjet, formatIdentifiantProjet } from '../projet.valueType';
import { createProjetAggregateId } from '../projet.aggregate';

export type ModifierGestionnaireRéseauProjetCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
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
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
