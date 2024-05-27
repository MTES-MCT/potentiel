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
    projet,
  }) => {
    const raccordement = await loadRaccordement(projet.identifiantProjet, false);

    // raccordement.attribuerGestionnaireAuRaccordement({
    //   identifiantGestionnaireRéseauValue,
    //   projet: {
    //     identifiantProjet: projet.identifiantProjet.formatter(),
    //     nomProjet: projet.nomProjet,
    //     appelOffre: projet.appelOffre,
    //     période: projet.période,
    //     famille: projet.famille,
    //     numéroCRE: projet.numéroCRE,
    //   },
    // });
  };

  mediator.register('Réseau.Gestionnaire.Command.AttribuerGestionnaireAuRaccordement', handler);
};
