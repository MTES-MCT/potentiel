import Badge from '@codegouvfr/react-dsfr/Badge';
import type { FC } from 'react';

type ProfilsBadgeProps = {
  profils: Record<string, boolean>;
  title: string;
};
export const ProfilesBadge: FC<ProfilsBadgeProps> = ({ profils, title }) => (
  <div className="flex flex-row flex-grow gap-2 mt-2 mb-3 justify-center" title={title}>
    {Object.entries(profils).map(([profil, value]) => (
      <Badge
        noIcon={value ? true : undefined}
        severity={value ? 'info' : 'error'}
        small
        key={profil}
        className="overflow-auto whitespace-nowrap"
      >
        {profil}
      </Badge>
    ))}
  </div>
);
