import type { FC, ReactNode } from 'react';

import type { DocumentProjet } from '@potentiel-domain/projet';

import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { TimelineItemBase, type TimelineItemBaseProps } from './TimelineItemBase';
import { TimelineItemFile } from './TimelineItemFile';

export type TimelineItemProps = TimelineItemBaseProps & {
  details?: ReactNode;
  file?: { document: DocumentProjet.ValueType; ariaLabel: string; label?: string };
  link?: { label: string; url: string; ariaLabel: string };
  reason?: string;
};

export const TimelineItem: FC<TimelineItemProps> = ({ details, file, reason, ...props }) => (
  <TimelineItemBase {...props}>
    {details && <div>{details}</div>}
    {reason && <DisplayRaisonChangement raison={reason} />}
    {file && <TimelineItemFile {...file} />}
  </TimelineItemBase>
);
