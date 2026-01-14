/* eslint-disable react/jsx-props-no-spreading */
import { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { DocumentProjet } from '@potentiel-domain/projet';

import { TimelineItemBase, TimelineItemBaseProps } from './TimelineItemBase';
import { TimelineItemFile } from './TimelineItemFile';

export type TimelineItemProps = TimelineItemBaseProps & {
  details?: ReactNode;
  file?: { document: DocumentProjet.ValueType; ariaLabel: string; label?: string };
  link?: { label: string; url: string; ariaLabel: string };
};

export const TimelineItem: FC<TimelineItemProps> = ({ details, file, ...props }) => {
  return (
    <TimelineItemBase {...props}>
      {details && <div className={clsx(props.title && 'mt-2')}>{details}</div>}
      {file && <TimelineItemFile {...file} />}
    </TimelineItemBase>
  );
};
