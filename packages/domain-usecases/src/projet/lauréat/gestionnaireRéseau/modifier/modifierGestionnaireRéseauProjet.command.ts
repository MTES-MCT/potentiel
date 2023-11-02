import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauProjetModifiéEventV1 } from '../gestionnaireRéseauProjet.event';
import { IdentifiantGestionnaireRéseauValueType } from '../../../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import {
  createGestionnaireRéseauProjetAggregateId,
  loadGestionnaireRéseauProjetAggregateFactory,
} from '../gestionnaireRéseauProjet.aggregate';
import { loadGestionnaireRéseauAggregateFactory } from '../../../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { ProjetInconnuError } from '../../../projet.error';
import { GestionnaireRéseauInconnuError } from '../../../../gestionnaireRéseau/gestionnaireRéseau.error';

export type ModifierGestionnaireRéseauProjetCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    identifiantProjet: IdentifiantProjetValueType;
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
  const loadProjet = loadGestionnaireRéseauProjetAggregateFactory({
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

    if (
      isNone(gestionnaireRéseauProjet) ||
      !gestionnaireRéseauProjet.estÉgaleÀ(gestionnaireRéseau)
    ) {
      const event: GestionnaireRéseauProjetModifiéEventV1 = {
        type: 'GestionnaireRéseauProjetModifié-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        },
      };

      await publish(createGestionnaireRéseauProjetAggregateId(identifiantProjet), event);
    }
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
