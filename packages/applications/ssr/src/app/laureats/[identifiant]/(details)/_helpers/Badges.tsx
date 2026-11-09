import Badge from '@mui/material/Badge';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { getTâches } from '../taches/_helpers/getTâches';

type BadgeDemandesEnCoursProps = {
  nombreDemandes: number;
};

export const BadgeDemandesEnCours: React.FC<BadgeDemandesEnCoursProps> = async ({
  nombreDemandes,
}) => {
  return (
    <Badge badgeContent={nombreDemandes} max={99} color="primary" overlap="circular">
      <div className="mr-10">Demandes en cours</div>
    </Badge>
  );
};

type BadgeTâchesProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

export const BadgeTâches: React.FC<BadgeTâchesProps> = async ({
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
      <div className={utilisateurEstPorteur ? 'mr-6' : 'mr-9'}>
        {utilisateurEstPorteur ? 'Tâches' : 'Tâches porteur'}
      </div>
    </Badge>
  );
};
