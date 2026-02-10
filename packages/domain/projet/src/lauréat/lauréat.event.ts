import { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event.js';
import { ChangementNomProjetEnregistréEvent } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event.js';
import { NomProjetModifiéEvent } from './nomProjet/modifier/nomProjetModifié.event.js';
import { SiteDeProductionModifiéEvent } from './site-de-production/siteDeProductionModifié.event.js';
import {
  LauréatNotifiéEvent,
  NomEtLocalitéLauréatImportésEvent,
  LauréatNotifiéV1Event,
} from './notifier/lauréatNotifié.event.js';
import { StatutLauréatModifiéEvent } from './statut/statutModifié.event.js';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | SiteDeProductionModifiéEvent
  | NomProjetModifiéEvent
  | CahierDesChargesChoisiEvent
  | ChangementNomProjetEnregistréEvent
  | StatutLauréatModifiéEvent;
