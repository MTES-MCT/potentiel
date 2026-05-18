import type { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';
import type { TypologieInstallationModifiéeEvent } from './modifier/modifierTypologieInstallation.event.js';

export type TypologieInstallationEvent =
  | InstallationImportéeEvent
  | TypologieInstallationModifiéeEvent;
