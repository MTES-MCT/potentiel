import {
  Abandon,
  Raccordement,
  Achèvement,
  ReprésentantLégal,
  Actionnaire,
  Lauréat,
  Puissance,
  CahierDesCharges,
  Producteur,
  Historique,
  Fournisseur,
  Délai,
  GarantiesFinancières,
  Installation,
  NatureDeLExploitation,
} from './lauréat/index.js';
import { Candidature } from './candidature/index.js';
import { Document } from './document/index.js';
import { Gestionnaire } from './réseau/index.js';
import { Projet } from './projet/index.js';
import { Recours, Éliminé } from './éliminé/index.js';
import { Tache } from './tâche/index.js';
import { Période } from './période/index.js';
import { Auth } from './auth/index.js';
import { StatistiquesPubliques } from './statistiques-publiques/index.js';
import { Utilisateur } from './utilisateur/index.js';
import { Accès } from './accès/index.js';
import { Export } from './export/index.js';

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
};
