import { ResultAsync } from '@core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { Publish } from '../../../core/domain/publish';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';

type AjouterGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
};

type AjouterGestionnaireRéseauDependencies = { publish: Publish };

type AjouterGestionnaireRéseauCommandHandler = (
  command: AjouterGestionnaireRéseauCommand,
) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>;

export const ajouterGestionnaireRéseauFactory =
  ({ publish }: AjouterGestionnaireRéseauDependencies): AjouterGestionnaireRéseauCommandHandler =>
  ({ codeEIC, raisonSociale, format, légende }) => {
    return publish(
      new GestionnaireRéseauAjouté({
        payload: {
          codeEIC,
          raisonSociale,
          format,
          légende,
        },
      }),
    );
  };
