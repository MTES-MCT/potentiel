import Badge from '@codegouvfr/react-dsfr/Badge';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

type EnvBadgeProps = {
  utilisateur: PotentielUtilisateur | undefined;
};
export const EnvBadge = ({ utilisateur }: EnvBadgeProps) => {
  if (!utilisateur || !process.env.APPLICATION_STAGE) {
    return null;
  }

  /**
   * Pour les env de tests on affiche pour tous les utilisateurs
   */
  if (process.env.APPLICATION_STAGE !== 'production') {
    return (
      <Badge className="fixed left-5 top-5 z-50" severity="info">
        {process.env.APPLICATION_STAGE.toUpperCase()}
      </Badge>
    );
  }

  /**
   * Pour la production, c'est uniquement réservé aux admin (nous)
   */
  return utilisateur.rôle.estAdmin() ? (
    <Badge className="fixed left-5 top-5 z-50" severity="warning">
      PRODUCTION
    </Badge>
  ) : null;
};
