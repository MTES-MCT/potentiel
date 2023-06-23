import {
  convertirEnIdentifiantGestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { loadAggregate } from '@potentiel/pg-event-sourcing';

export const loadGestionnaireRéseauAggregate = async (codeEIC: string) => {
  const actualAggregate = await loadGestionnaireRéseauAggregateFactory({ loadAggregate })(
    convertirEnIdentifiantGestionnaireRéseau(codeEIC),
  );

  if (isNone(actualAggregate)) {
    throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
  }

  return actualAggregate;
};
