import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { StatutDemandeBadge, type StatutDemandeBadgeProps } from './StatutDemandeBadge';

type Props = { titre: string; statut: StatutDemandeBadgeProps['statut'] };

export const TitrePageDemande: FC<Props> = ({ titre, statut }) => (
  // <div className="flex flex-row gap-4">
  //   <div className="flex-shrink-0">
  //     <Heading1>{titre}</Heading1>
  //   </div>
  //   <div className="flex-shrink-0">
  //     <StatutDemandeBadge statut={statut} />
  //   </div>
  // </div>
  <div className="flex items-center gap-4">
    <Heading1>{titre}</Heading1>
    <StatutDemandeBadge statut={statut} />
  </div>
);
