import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getDashboardRoute = (rôle: Role.ValueType) => {
  if (rôle.aLaPermission('lauréat.lister')) {
    if (rôle.estPorteur()) {
      return {
        texte: 'Voir mes projets lauréats',
        lien: Routes.Lauréat.lister(),
      };
    }
    return {
      texte: 'Voir les projets lauréats',
      lien: Routes.Lauréat.lister(),
    };
  }

  if (rôle.aLaPermission('raccordement.listerDossierRaccordement')) {
    return { texte: 'Voir les raccordements', lien: Routes.Raccordement.lister };
  }

  if (rôle.aLaPermission('accès.réclamerProjet')) {
    return { texte: 'Réclamer des projets', lien: Routes.Accès.réclamerProjet };
  }

  getLogger().warn("Le rôle n'a pas de page par défaut définie", { rôle: rôle.nom });

  return {
    texte: "Page d'accueil",
    lien: '/',
  };
};
