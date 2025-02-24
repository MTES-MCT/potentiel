import { IdentifiantProjet } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';

type ProjetData = {
  nom: string;
  région: string;
  appelOffre: string;
  période: string;
  famille?: string;
};

export const projetDataDefaultValue = {
  nom: 'Projet inconnu',
  région: '',
  appelOffre: `N/A`,
  période: `N/A`,
};

// TODO: refacto ces 2 fonctions pour un join sur lauréat idéalement (et arrêter de mettre ces données qui peuvent être modifiées dans chaque projection)
export const getProjectDataFromProjet = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<ProjetData> => {
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

  if (Option.isNone(projet)) {
    getLogger().warn(`Projet inconnu !`, {
      identifiantProjet,
    });

    return projetDataDefaultValue;
  }

  return {
    nom: projet.nom,
    appelOffre: projet.appelOffre,
    période: projet.période,
    famille: projet.famille,
    région: projet.localité.région,
  };
};

export const getProjectDataFromCandidature = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<ProjetData | void> => {
  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet}`,
  );

  if (Option.isNone(candidature)) {
    return undefined;
  }

  const { appelOffre, période, famille } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    nom: candidature.nomProjet,
    appelOffre,
    période,
    famille,
    région: candidature.localité.région,
  };
};
