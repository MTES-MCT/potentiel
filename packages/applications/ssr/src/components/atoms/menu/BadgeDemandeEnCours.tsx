import Badge from '@mui/material/Badge';

type GetMenuItemsProps = {
  nombreDemandes: number;
};

export const BadgeDemandesEnCours: React.FC<GetMenuItemsProps> = async ({ nombreDemandes }) => {
  return (
    <Badge badgeContent={nombreDemandes} max={99} color="primary" overlap="circular">
      <div className="mr-12">Demandes en cours</div>
    </Badge>
  );
};
