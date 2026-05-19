import type { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event.js';
import type { ChangementNomProjetEnregistréEvent } from './nom-projet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event.js';
import type { NomProjetModifiéEvent } from './nom-projet/modifier/nomProjetModifié.event.js';
import type {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event.js';
import type { SiteDeProductionModifiéEvent } from './site-de-production/siteDeProductionModifié.event.js';
import type { StatutLauréatModifiéEvent } from './statut/statutModifié.event.js';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | SiteDeProductionModifiéEvent
  | NomProjetModifiéEvent
  | CahierDesChargesChoisiEvent
  | ChangementNomProjetEnregistréEvent
  | StatutLauréatModifiéEvent;
