import { IdentifiantProjet } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

  if (Option.isNone(projet)) {
    getLogger().warn(`Projet inconnu !`, {
      identifiantProjet,
    });

    return {
      nomProjet: 'Projet inconnu',
      appelOffre: `N/A`,
      période: `N/A`,
      famille: undefined,
      régionProjet: '',
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
