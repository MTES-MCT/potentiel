import Badge from '@mui/material/Badge';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { getTâches } from '../../../app/laureats/[identifiant]/(détails)/taches/_helpers/getTâches';

type GetMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

export const BadgeTâches: React.FC<GetMenuItemsProps> = async ({
  identifiantProjet,
  utilisateur,
}) => {
  const tâches = await getTâches(
    identifiantProjet.formatter(),
    utilisateur.identifiantUtilisateur.email,
  );

  const utilisateurEstPorteur = utilisateur.rôle.estPorteur();

  return (
    <Badge
      badgeContent={tâches.total}
      max={99}
      color="primary"
      overlap="circular"
      invisible={tâches.total === 0}
    >
      <div className={utilisateurEstPorteur ? 'mr-6' : 'mr-8'}>
        {utilisateurEstPorteur ? 'Tâches' : 'Tâches porteur'}
      </div>
    </Badge>
  );
};
