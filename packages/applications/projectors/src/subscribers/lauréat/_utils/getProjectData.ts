import { IdentifiantProjet } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const getProjectData = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

  if (Option.isNone(projet)) {
    getLogger().error(`Projet inconnu !`, {
      identifiantProjet,
    });
    return;
  }

  return {
    nom: projet.nom,
    appelOffre: projet.appelOffre,
    période: projet.période,
    famille: projet.famille,
    numéroCRE: projet.numéroCRE,
    région: projet.localité.région,
  };
};
