import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { TypologieInstallationModifiéeEvent } from './modifier/modifierTypologieInstallation.event';

export type TypologieInstallationEvent =
  | InstallationImportéeEvent
  | TypologieInstallationModifiéeEvent;
