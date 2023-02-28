import { ResultAsync } from '@core/utils';
import { Permission } from '@modules/authN';
import { ListeDétailGestionnairesRéseauReadModel } from '@modules/gestionnaireRéseau';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { RésuméProjetReadModel } from './RésuméProjet';

export const PermissionModifierIdentifiantGestionnaireReseau: Permission = {
  nom: 'modifier-identifiant-gestionnaire-reseau',
  description: "Modifier l'identifiant du gestionnaire de réseau",
};

export type ModifierGestionnaireRéseauReadModel = {
  projet: RésuméProjetReadModel;
  listeDétailGestionnaires?: ListeDétailGestionnairesRéseauReadModel;
};

export type ModifierGestionnaireRéseauQueryHandler = (
  projetId: string,
) => ResultAsync<ModifierGestionnaireRéseauReadModel, EntityNotFoundError | InfraNotAvailableError>;
