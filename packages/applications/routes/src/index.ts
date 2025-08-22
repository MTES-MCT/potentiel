import { Auth } from './auth';
import { Candidature } from './candidature';
import { Document } from './document';
import {
  Abandon,
  Achèvement,
  Actionnaire,
  CahierDesCharges,
  Délai,
  Fournisseur,
  GarantiesFinancières,
  Historique,
  Lauréat,
  Producteur,
  Puissance,
  Raccordement,
  ReprésentantLégal,
} from './lauréat';
import { Projet } from './projet';
import { Période } from './période';
import { Gestionnaire } from './réseau';
import { StatistiquesPubliques } from './statistiques-publiques';
import { Tache } from './tâche';
import { Utilisateur } from './utilisateur';
import { Recours } from './éliminé';

export const Routes = {
  Abandon,
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
};
