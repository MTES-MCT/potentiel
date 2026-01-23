import { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';
import { ChangementNomProjetEnregistréEvent } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event';
import { NomProjetModifiéEvent } from './nomProjet/modifier/nomProjetModifié.event';
import { SiteDeProductionModifiéEvent } from './site-de-production/siteDeProductionModifié.event';
import {
  LauréatNotifiéEvent,
  NomEtLocalitéLauréatImportésEvent,
  LauréatNotifiéV1Event,
} from './notifier/lauréatNotifié.event';
import { StatutLauréatModifiéEvent } from './statut/statutModifié.event';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | SiteDeProductionModifiéEvent
  | NomProjetModifiéEvent
  | CahierDesChargesChoisiEvent
  | ChangementNomProjetEnregistréEvent
  | StatutLauréatModifiéEvent;
