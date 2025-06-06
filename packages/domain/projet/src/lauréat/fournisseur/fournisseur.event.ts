import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

export type FournisseurEvent = FournisseurImportéEvent | ÉvaluationCarboneModifiéeEvent;
