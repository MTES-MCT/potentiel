import { TransactionalRepository, UniqueEntityID } from '@core/domain';
import { errAsync, ResultAsync } from '@core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { Publish } from '../../../core/domain/publish';
import { GestionnaireRéseau } from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error';

export const PermissionAjouterGestionnaireRéseau = {
  nom: 'ajouter-gestionnaire-réseau',
  description: 'Ajouter un gestionnaire de réseau',
};

type AjouterGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
};

type AjouterGestionnaireRéseauDependencies = {
  publish: Publish;
  repository: TransactionalRepository<GestionnaireRéseau>;
};

type AjouterGestionnaireRéseauCommandHandler = (
  command: AjouterGestionnaireRéseauCommand,
) => ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError | GestionnaireRéseauDéjàExistantError
>;

export const ajouterGestionnaireRéseauFactory =
  ({
    publish,
    repository,
  }: AjouterGestionnaireRéseauDependencies): AjouterGestionnaireRéseauCommandHandler =>
  ({ codeEIC, raisonSociale, format, légende }) => {
    return repository.transaction(
      new UniqueEntityID(codeEIC),
      (gestionnaireRéseau) => {
        if (!gestionnaireRéseau.codeEIC) {
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
        }

        return errAsync(new GestionnaireRéseauDéjàExistantError());
      },
      { acceptNew: true },
    );
  };
