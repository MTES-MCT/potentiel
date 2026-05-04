import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { getContext } from '@potentiel-applications/request-context';

export const PPABadge: FC = () => {
  const { features } = getContext() ?? {};

  return features?.includes('PPA') ? (
    <Badge small noIcon severity="new">
      PPA
    </Badge>
  ) : (
    <></>
  );
};
