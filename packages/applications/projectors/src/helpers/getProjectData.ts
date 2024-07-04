import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);
  if (Option.isNone(projet)) {
    getLogger().warn(`Projet inconnu !`),
      {
        identifiantProjet,
        message: event,
      };
    return {
      nomProjet: 'Projet inconnu',
      appelOffre: `Appel d'offres inconnu`,
      période: `Période inconnue`,
      famille: '',
      régionProjet: 'Région inconnue',
    };
  }
  return {
    nomProjet: projet.nom,
    appelOffre: projet.appelOffre,
    période: projet.période,
    famille: projet.famille,
    régionProjet: projet.localité.région,
  };
};
