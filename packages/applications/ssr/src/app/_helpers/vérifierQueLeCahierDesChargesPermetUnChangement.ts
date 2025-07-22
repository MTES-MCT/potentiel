import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getPériodeAppelOffres } from './getPériodeAppelOffres';
import { getCahierDesCharges } from './getCahierDesCharges';

export const vérifierQueLeCahierDesChargesPermetUnChangement = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  typeChangement: 'informationEnregistrée' | 'demande',
  domaine: AppelOffre.DomainesConcernésParChangement,
) => {
  const { appelOffres, période, famille } = await getPériodeAppelOffres(identifiantProjet);
  const cahierDesChargesChoisi = await getCahierDesCharges(identifiantProjet.formatter());

  const cahierDesCharges = AppelOffre.CahierDesCharges.bind({
    appelOffre: appelOffres,
    période,
    famille,
    cahierDesChargesModificatif:
      cahierDesChargesChoisi.type === 'initial' ? undefined : cahierDesChargesChoisi,
    technologie: undefined,
  });

  cahierDesCharges.vérifierQueLeChangementEstPossible(typeChangement, domaine);
};
