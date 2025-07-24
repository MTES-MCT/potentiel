import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { getCahierDesCharges } from './getCahierDesCharges';

// duplicata de packages/applications/ssr/src/app/_helpers
// sera supprimé après la migration de la page projet
export const récupérerChangementsPermisParLeCahierDesCharges = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  domaine: AppelOffre.DomainesConcernésParChangement,
) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
  return {
    demandeEstPossible: cahierDesCharges.changementEstDisponible('demande', domaine),
    informationEnregistréeEstPossible: cahierDesCharges.changementEstDisponible(
      'information-enregistrée',
      domaine,
    ),
  };
};
