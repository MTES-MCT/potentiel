/* eslint-disable react/jsx-props-no-spreading */
import { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { DocumentProjet } from '@potentiel-domain/projet';

import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

import { TimelineItemBase, TimelineItemBaseProps } from './TimelineItemBase';
import { TimelineItemFile } from './TimelineItemFile';

export type TimelineItemProps = TimelineItemBaseProps & {
  details?: ReactNode;
  file?: { document: DocumentProjet.ValueType; ariaLabel: string; label?: string };
  link?: { label: string; url: string; ariaLabel: string };
  reason?: string;
};

export const TimelineItem: FC<TimelineItemProps> = ({ details, file, reason, ...props }) => {
  return (
    <TimelineItemBase {...props}>
      {details && <div className={clsx(props.title && 'mt-2')}>{details}</div>}
      {reason && <DisplayRaisonChangement raison={reason} />}
      {file && <TimelineItemFile {...file} />}
    </TimelineItemBase>
  );
};
