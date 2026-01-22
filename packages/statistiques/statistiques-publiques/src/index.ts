import {
  cleanCartoProjetStatistic,
  cleanScalarStatistic,
  cleanCamembertStatistic,
  cleanUtilisateurStatistic,
} from './_utils/index.js';
import { computeEnsembleDesProjets } from './01-ensemble-des-projets/index.js';
import { computeAvancementDesProjets } from './02-avancement-des-projets/index.js';
import { computeDemandesDeModification } from './03-demandes-de-modification/index.js';
import { computeMiseEnService } from './04-mise-en-service/index.js';
import { computeGarantiesFinancieres } from './05-garanties-financieres/index.js';
import { computeParCycle } from './06-par-cycle/index.js';
import { computeUtilisateur } from './07-utilisateur/index.js';
import { computeCarte } from './08-carte/index.js';

export const cleanStatistiquesPubliques = async () => {
  await cleanCartoProjetStatistic();
  await cleanScalarStatistic();
  await cleanCamembertStatistic();
  await cleanUtilisateurStatistic();
};

export const computeStatistiquesPubliques = async () => {
  await computeEnsembleDesProjets();
  await computeAvancementDesProjets();
  await computeDemandesDeModification();
  await computeMiseEnService();
  await computeGarantiesFinancieres();
  await computeParCycle();
  await computeUtilisateur();
  await computeCarte();
};
