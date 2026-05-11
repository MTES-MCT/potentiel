import Badge from '@codegouvfr/react-dsfr/Badge';
import { featureFlag } from '@potentiel-applications/feature-flag';
import { FC } from 'react';

export const PPABadge: FC = () =>
  featureFlag.includes('PPA') ? (
    <Badge small noIcon severity="new">
      PPA
    </Badge>
  ) : undefined;
