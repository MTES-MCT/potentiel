import Badge from '@mui/material/Badge';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { getTâches } from '../taches/_helpers/getTâches';

type GetMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

export const BadgeTâches: React.FC<React.PropsWithChildren<GetMenuItemsProps>> = async ({
  identifiantProjet,
  utilisateur,
  children,
}) => {
  const tâches = await getTâches(
    identifiantProjet.formatter(),
    utilisateur.identifiantUtilisateur.email,
  );
  return (
    <Badge
      badgeContent={tâches.total}
      max={99}
      color="primary"
      overlap="circular"
      invisible={tâches.total === 0}
    >
      <div className="mr-6">{children}</div>
    </Badge>
  );
};
