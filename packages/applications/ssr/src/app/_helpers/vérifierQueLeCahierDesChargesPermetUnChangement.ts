import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from './getCahierDesCharges';

export const vérifierQueLeCahierDesChargesPermetUnChangement = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  typeChangement: 'information-enregistrée' | 'demande',
  domaine: AppelOffre.DomainesConcernésParMiseÀJour,
) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
  cahierDesCharges.vérifierQueLeChangementEstPossible(typeChangement, domaine);
};
