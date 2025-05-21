import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

type ProfilesBadgeProps = {
  profiles: Record<string, boolean>;
  title: string;
};
export const ProfilesBadge: FC<ProfilesBadgeProps> = ({ profiles, title }) => (
  <div
    className="flex flex-row flex-grow gap-2 mt-2 mb-3 justify-center"
    title={title}
    aria-label={title}
  >
    {Object.entries(profiles).map(([profile, value]) => (
      <Badge
        noIcon={value ? true : undefined}
        severity={value ? 'info' : 'error'}
        small
        key={profile}
        className="overflow-auto whitespace-nowrap"
      >
        {profile}
      </Badge>
    ))}
  </div>
);
