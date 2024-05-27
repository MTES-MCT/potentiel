import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../../gestionnaire/identifiantGestionnaireRéseau.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type AttribuerGestionnaireAuRaccordementCommand = Message<
  'Réseau.Gestionnaire.Command.AttribuerGestionnaireAuRaccordement',
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

export const registerAttribuerGestionnaireAuRaccordementCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireAuRaccordementCommand> = async ({
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

  mediator.register('Réseau.Gestionnaire.Command.AttribuerGestionnaireAuRaccordement', handler);
};
