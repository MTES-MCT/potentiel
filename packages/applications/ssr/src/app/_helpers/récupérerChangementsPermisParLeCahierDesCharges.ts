import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from './getCahierDesCharges';

export const récupérerChangementsPermisParLeCahierDesCharges = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  domaine: AppelOffre.DomainesConcernésParChangement,
) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
  return {
    demandeEstPossible: cahierDesCharges.changementEstDisponible('demande', domaine),
    informationEnregistréeEstPossible: cahierDesCharges.changementEstDisponible(
      'information-enregistrée',
      domaine,
    ),
  };
};
