import {
  cleanCartoProjetStatistic,
  cleanScalarStatistic,
  cleanCamembertStatistic,
  cleanUtilisateurStatistic,
} from './_utils';
import { computeEnsembleDesProjets } from './01-ensemble-des-projets';
import { computeAvancementDesProjets } from './02-avancement-des-projets';
import { computeDemandesDeModification } from './03-demandes-de-modification';
import { computeMiseEnService } from './04-mise-en-service';
import { computeGarantiesFinancieres } from './05-garanties-financieres';
import { computeParCycle } from './06-par-cycle';
import { computeUtilisateur } from './07-utilisateur';
import { computeCarte } from './08-carte';

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
