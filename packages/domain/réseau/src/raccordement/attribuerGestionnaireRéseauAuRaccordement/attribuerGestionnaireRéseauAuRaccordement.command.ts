import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../../gestionnaire/identifiantGestionnaireRéseau.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type AttribuerGestionnaireRéseauAuRaccordementCommand = Message<
  'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAuRaccordement',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
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

  const handler: MessageHandler<AttribuerGestionnaireRéseauAuRaccordementCommand> = async ({
    identifiantGestionnaireRéseau,
    projet,
  }) => {
    const raccordement = await loadRaccordement(projet.identifiantProjet, false);

    raccordement.attribuerGestionnaireRéseauAuRaccordement({
      identifiantGestionnaireRéseau,
      projet: {
        identifiantProjet: projet.identifiantProjet,
        nomProjet: projet.nomProjet,
        appelOffre: projet.appelOffre,
        période: projet.période,
        famille: projet.famille,
        numéroCRE: projet.numéroCRE,
      },
    });
  };

  mediator.register(
    'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAuRaccordement',
    handler,
  );
};
