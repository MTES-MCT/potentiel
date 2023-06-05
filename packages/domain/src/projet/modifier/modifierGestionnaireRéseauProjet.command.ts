import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjetInconnuError } from './projetInconnu.error';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjet, formatIdentifiantProjet } from '../projet.valueType';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { loadGestionnaireRéseauAggregateFactory } from '../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/modifier/gestionnaireRéseauInconnu.error';

export type ModifierGestionnaireRéseauProjetCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
    identifiantProjet: IdentifiantProjet;
  }
>;

export type ModifierGestionnaireRéseauProjetDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerModifierGestionnaireRéseauProjetCommand = ({
  publish,
  loadAggregate,
}: ModifierGestionnaireRéseauProjetDependencies) => {
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });

  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<ModifierGestionnaireRéseauProjetCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const [projet, gestionnaireRéseau] = await Promise.all([
      loadProjet(identifiantProjet),
      loadGestionnaireRéseauAggregate(identifiantGestionnaireRéseau),
    ]);

    if (isNone(projet)) {
      throw new ProjetInconnuError();
    }

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const gestionnaireRéseauProjet = await projet.getGestionnaireRéseau();

    if (isNone(gestionnaireRéseauProjet) || !gestionnaireRéseauProjet.equals(gestionnaireRéseau)) {
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
    }
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
