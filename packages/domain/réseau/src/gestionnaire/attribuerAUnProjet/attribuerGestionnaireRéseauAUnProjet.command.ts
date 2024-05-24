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
      identifiantProjet: IdentifiantProjet.ValueType;
      nomProjet: string;
      appelOffre: string;
      période: string;
      famille: string;
      numéroCRE: string;
    };
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetCommand> = async ({
    identifiantGestionnaireRéseauValue,
    projet: { identifiantProjet, nomProjet, appelOffre, période, famille, numéroCRE },
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet, false);

    console.log('🤡 RACCORDEMENT'), raccordement;
    // await raccordement.

    // TODO: call à un usecase pour ajouter un raccordement vide
    // je pense qu'il faut créer un nouveau usecase dans raccordement
    // ou ajouter une fonction "ajouter" dans l'aggrégat de raccordement à l'instar de gestionnaire de réseau
  };

  mediator.register('Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAUnProjet', handler);
};
