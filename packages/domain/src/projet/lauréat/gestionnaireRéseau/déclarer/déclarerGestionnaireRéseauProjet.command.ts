import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome, none } from '@potentiel/monads';
import { GestionnaireRéseauProjetDéclaréEvent } from '../gestionnaireRéseauProjet.event';
import { IdentifiantGestionnaireRéseauValueType } from '../../../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import {
  createGestionnaireRéseauProjetAggregateId,
  loadGestionnaireRéseauProjetAggregateFactory,
} from '../gestionnaireRéseauProjet.aggregate';
import { loadGestionnaireRéseauAggregateFactory } from '../../../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { GestionnaireRéseauInconnuError } from '../../../../gestionnaireRéseau/gestionnaireRéseau.error';

export type DéclarerGestionnaireRéseauProjetCommand = Message<
  'DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type DéclarerGestionnaireRéseauProjetDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerDéclarerGestionnaireRéseauProjetCommand = ({
  publish,
  loadAggregate,
}: DéclarerGestionnaireRéseauProjetDependencies) => {
  const loadProjet = loadGestionnaireRéseauProjetAggregateFactory({
    loadAggregate,
  });

  const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<DéclarerGestionnaireRéseauProjetCommand> = async ({
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

    const gestionnaireRéseauProjet = isSome(projet) ? await projet.getGestionnaireRéseau() : none;

    if (isNone(gestionnaireRéseauProjet)) {
      const event: GestionnaireRéseauProjetDéclaréEvent = {
        type: 'GestionnaireRéseauProjetDéclaré',
        payload: {
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
          identifiantProjet: identifiantProjet.formatter(),
        },
      };

      await publish(createGestionnaireRéseauProjetAggregateId(identifiantProjet), event);
    } else {
      if (!gestionnaireRéseauProjet.estÉgaleÀ(gestionnaireRéseau)) {
        // TODO: Ce cas doit être moinitoré. Il est fonctionnellement impossible, mais technique déclenchable.
        console.log(
          `WARNING: La déclaration est invalide. Le projet dispose déjà d'un gestionnaire de réseau et cette déclaration correspond à un gestionnaire de réseau différent`,
        );
      }
    }
  };

  mediator.register('DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
