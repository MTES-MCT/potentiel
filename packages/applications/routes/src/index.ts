import { Accès } from './accès/index.js';
import { Auth } from './auth/index.js';
import { Candidature } from './candidature/index.js';
import { Document } from './document/index.js';
import { Export } from './export/index.js';
import {
  Abandon,
  Achèvement,
  Actionnaire,
  CahierDesCharges,
  Délai,
  Fournisseur,
  GarantiesFinancières,
  Historique,
  Installation,
  Lauréat,
  NatureDeLExploitation,
  PowerPurchaseAgreement,
  Producteur,
  Puissance,
  Raccordement,
  ReprésentantLégal,
} from './lauréat/index.js';
import { Projet } from './projet/index.js';
import { Période } from './période/index.js';
import { Gestionnaire } from './réseau/index.js';
import { StatistiquesPubliques } from './statistiques-publiques/index.js';
import { Tache } from './tâche/index.js';
import { Utilisateur } from './utilisateur/index.js';
import { Recours, Éliminé } from './éliminé/index.js';

export const Routes = {
  Abandon,
  Accès,
  Achèvement,
  Candidature,
  Document,
  Gestionnaire,
  Projet,
  Raccordement,
  Recours,
  Tache,
  Période,
  Auth,
  ReprésentantLégal,
  Actionnaire,
  Lauréat,
  StatistiquesPubliques,
  Utilisateur,
  Puissance,
  CahierDesCharges,
  Producteur,
  Historique,
  Fournisseur,
  Délai,
  GarantiesFinancières,
  Installation,
  NatureDeLExploitation,
  Éliminé,
  Export,
  PowerPurchaseAgreement,
};
