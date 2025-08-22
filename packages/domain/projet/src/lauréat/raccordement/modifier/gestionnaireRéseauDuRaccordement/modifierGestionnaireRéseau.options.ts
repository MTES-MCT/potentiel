import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Role } from '@potentiel-domain/utilisateur';

export type ModifierGestionnaireRéseauOptions = {
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  rôle: Role.ValueType;
};
