import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseauValueType } from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { loadGestionnaireRéseauAggregateFactory } from '../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { isNone, isSome } from '@potentiel/monads';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import { GestionnaireRéseauProjetDéjàAjoutéErreur } from '../projet.error';
import { GestionnaireRéseauProjetAjoutéEvent } from '../projet.event';

export type AjouterGestionnaireRéseauProjetCommand = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type AjouterGestionnaireRéseauProjetDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAjouterGestionnaireRéseauProjetCommand = ({
  publish,
  loadAggregate,
}: AjouterGestionnaireRéseauProjetDependencies) => {
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });

  const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<AjouterGestionnaireRéseauProjetCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const [projet, gestionnaireRéseau] = await Promise.all([
      loadProjet(identifiantProjet),
      loadGestionnaireRéseau(identifiantGestionnaireRéseau),
    ]);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    if (isSome(projet) && isSome(await projet.getGestionnaireRéseau())) {
      throw new GestionnaireRéseauProjetDéjàAjoutéErreur();
    }

    const event: GestionnaireRéseauProjetAjoutéEvent = {
      type: 'GestionnaireRéseauProjetAjouté',
      payload: {
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        identifiantProjet: identifiantGestionnaireRéseau.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
