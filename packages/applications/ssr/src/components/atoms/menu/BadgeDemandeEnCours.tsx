import Badge from '@mui/material/Badge';

import { Utilisateur } from '@potentiel-domain/utilisateur';

type GetMenuItemsProps = {
  nombreDemandes: number;
  utilisateur: Utilisateur.ValueType;
};

export const BadgeDemandesEnCours: React.FC<GetMenuItemsProps> = async ({
  nombreDemandes,
  utilisateur,
}) => {
  const utilisateurEstPorteur = utilisateur.rôle.estPorteur();

  return (
    <Badge badgeContent={nombreDemandes} max={99} color="primary" overlap="circular">
      <div className={utilisateurEstPorteur ? 'mr-10' : 'mr-12'}>
        {utilisateurEstPorteur ? 'Demandes à traiter' : 'Demandes en cours'}
      </div>
    </Badge>
  );
};
