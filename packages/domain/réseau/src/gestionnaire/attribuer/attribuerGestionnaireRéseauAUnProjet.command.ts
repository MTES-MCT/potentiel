import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { loadRaccordementAggregateFactory } from '../../raccordement/raccordement.aggregate';

export type AttribuerGestionnaireRéseauAUnProjetCommand = Message<
  'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAUnProjet',
  {
    identifiantGestionnaireRéseauValue: IdentifiantGestionnaireRéseau.ValueType;
    projet: {
      identifiantProjetValue: IdentifiantProjet.ValueType;
      nomProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
    isValidatedByPorteurValue: boolean;
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetCommand = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetCommand> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
    isValidatedByPorteurValue,
  }) => {
    // vérifier qu'on a pas déjà un raccordement
    const raccordement = await load(projet.identifiantProjetValue, false);

    if(raccordement){
      throw une erreur
    }

    // TODO: call à un usecase pour ajouter un raccordement vide
    // je pense qu'il faut créer un nouveau usecase dans raccordement
    // ou ajouter une fonction "ajouter" dans l'aggrégat de raccordement à l'instar de gestionnaire de réseau
  };

  mediator.register('Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAUnProjet', handler);
};
