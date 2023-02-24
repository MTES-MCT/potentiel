import { EventStore } from '@core/domain';
import { errAsync, ResultAsync } from '@core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';

type AjouterGestionnaireRéseauCommande = { nom: string; format?: string; légende?: string };

type AjouterGestionnaireRéseauDépendances = { publishToEventStore: EventStore['publish'] };

type AjouterGestionnaireRéseau = (
  args: AjouterGestionnaireRéseauCommande,
) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>;

export const makeAjouterGestionnaireRéseau =
  ({ publishToEventStore }: AjouterGestionnaireRéseauDépendances): AjouterGestionnaireRéseau =>
  ({ nom, format, légende }) => {
    return errAsync(new Error(`not implemented`));
  };
