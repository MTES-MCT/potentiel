import { InstallationImportéeEvent } from '../importer/importerInstallation.event.js';

import { TypologieInstallationModifiéeEvent } from './modifier/modifierTypologieInstallation.event.js';

export type TypologieInstallationEvent =
  | InstallationImportéeEvent
  | TypologieInstallationModifiéeEvent;
