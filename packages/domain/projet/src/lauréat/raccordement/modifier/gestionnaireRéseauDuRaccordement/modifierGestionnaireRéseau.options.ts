import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';

export type ModifierGestionnaireRéseauOptions = {
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  rôle: Role.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
