import { Subscribe } from '@potentiel/core-domain';
import { ConsulterProjetDependencies } from './consulter/consulterProjet.query';
import { GestionnaireRéseauProjetModifiéDependencies } from './modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
import { ModifierGestionnaireRéseauProjetDependencies } from './modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';

type QueryDependencies = ConsulterProjetDependencies;
type CommandDependencies = ModifierGestionnaireRéseauProjetDependencies;
type EventDependencies = GestionnaireRéseauProjetModifiéDependencies;

export type ProjetDependencies = { subscribe: Subscribe } & QueryDependencies &
  CommandDependencies &
  EventDependencies;
