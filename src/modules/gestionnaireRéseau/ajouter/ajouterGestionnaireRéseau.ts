import { Repository, UniqueEntityID } from '@core/domain';
import { errAsync, ResultAsync } from '@core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { Publish } from '../../../core/domain/publish';
import { GestionnaireRéseau } from '../gestionnaireRéseauAggregate';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';
import { GestionnaireRéseauDéjàExistantError } from './GestionnaireRéseauDéjàExistantError';

type AjouterGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
};

type AjouterGestionnaireRéseauDependencies = {
  publish: Publish;
  repository: Repository<GestionnaireRéseau>;
};

type AjouterGestionnaireRéseauCommandHandler = (
  command: AjouterGestionnaireRéseauCommand,
) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>;

export const ajouterGestionnaireRéseauFactory =
  ({
    publish,
    repository,
  }: AjouterGestionnaireRéseauDependencies): AjouterGestionnaireRéseauCommandHandler =>
  ({ codeEIC, raisonSociale, format, légende }) => {
    return repository
      .load(new UniqueEntityID(codeEIC))
      .andThen((gestionnaireRéseau: GestionnaireRéseau | undefined) => {
        if (gestionnaireRéseau && gestionnaireRéseau.codeEIC === codeEIC) {
          return errAsync(new GestionnaireRéseauDéjàExistantError());
        }
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
      });
  };
