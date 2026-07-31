import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { StatutDemandeBadge, type StatutDemandeBadgeProps } from './StatutDemandeBadge';

type Props = { titre: string; statut: StatutDemandeBadgeProps['statut'] };

export const TitrePageDemande: FC<Props> = ({ titre, statut }) => (
  <div className="flex items-center gap-4">
    <Heading1>{titre}</Heading1>
    <StatutDemandeBadge statut={statut} />
  </div>
);
