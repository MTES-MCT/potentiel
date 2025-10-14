import { InstallationImportéeEvent } from '../importer/importerInstallation.event';

import { TypologieDuProjetModifiéeEvent } from './modifier/modifierTypologieDuProjet.event';

export type TypologieDuProjetEvent = InstallationImportéeEvent | TypologieDuProjetModifiéeEvent;
