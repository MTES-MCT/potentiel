import { CommandHandler, LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifié.event';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';

type ModifierGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
};

type ModifierGestionnaireRéseauDependencies = { publish: Publish; loadAggregate: LoadAggregate };

type ModifierGestionnaireRéseauFactory = (
  dependencies: ModifierGestionnaireRéseauDependencies,
) => CommandHandler<ModifierGestionnaireRéseauCommand>;

export const modifierGestionnaireRéseauFactory: ModifierGestionnaireRéseauFactory = ({
  publish,
  loadAggregate,
}) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  return async ({ codeEIC, raisonSociale, aideSaisieRéférenceDossierRaccordement }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };
};
