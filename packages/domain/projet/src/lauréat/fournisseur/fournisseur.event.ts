import { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';

export type FournisseurEvent = FournisseurImportéEvent | ChangementFournisseurEnregistréEvent;
