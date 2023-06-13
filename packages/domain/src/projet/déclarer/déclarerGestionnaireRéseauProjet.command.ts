import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseauValueType } from '../../gestionnaireRéseau/gestionnaireRéseau.valueType';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { loadGestionnaireRéseauAggregateFactory } from '../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { isNone, isSome } from '@potentiel/monads';
import { GestionnaireRéseauInconnuError } from '../../gestionnaireRéseau/gestionnaireRéseau.error';
import { GestionnaireRéseauProjetDéjàDéclaréErreur } from '../projet.error';
import { GestionnaireRéseauProjetDéclaréEvent } from '../projet.event';

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
  const loadProjet = loadProjetAggregateFactory({
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

    if (isSome(projet) && isSome(await projet.getGestionnaireRéseau())) {
      throw new GestionnaireRéseauProjetDéjàDéclaréErreur();
    }

    const event: GestionnaireRéseauProjetDéclaréEvent = {
      type: 'GestionnaireRéseauProjetDéclaré',
      payload: {
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET', handler);
};
