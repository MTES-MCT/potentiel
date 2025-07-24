import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from './getCahierDesCharges';

export const récupérerChangementsPermisParLeCahierDesCharges = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  domaine: AppelOffre.DomainesConcernésParChangement,
) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
  return {
    demande: cahierDesCharges.changementEstDisponible('demande', domaine),
    informationEnregistrée: cahierDesCharges.changementEstDisponible(
      'information-enregistrée',
      domaine,
    ),
  };
};
