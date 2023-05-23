import { AjouterGestionnaireRéseauDependencies } from './ajouter/ajouterGestionnaireRéseau.command';
import { ConsulterGestionnaireRéseauDependencies } from './consulter/consulterGestionnaireRéseau.query';
import { ListerGestionnaireRéseauDependencies } from './lister/listerGestionnaireRéseau.query';
import { ModifierGestionnaireRéseauDependencies } from './modifier/modifierGestionnaireRéseau.command';
import { GestionnaireRéseauAjoutéHandlerDependencies } from './ajouter/handlers/gestionnaireRéseauAjouté.handler';
import { GestionnaireRéseauModifiéHandlerDependencies } from './modifier/handlers/gestionnaireRéseauModifié.handler';
import { Subscribe } from '@potentiel/core-domain';

type QueryDependencies = ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies;
type CommandDependencies = AjouterGestionnaireRéseauDependencies &
  ModifierGestionnaireRéseauDependencies;
type EventDependencies = GestionnaireRéseauAjoutéHandlerDependencies &
  GestionnaireRéseauModifiéHandlerDependencies;

export type GestionnaireRéseauDependencies = { subscribe: Subscribe } & QueryDependencies &
  CommandDependencies &
  EventDependencies;
