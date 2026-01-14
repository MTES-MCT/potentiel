import { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { DocumentProjet } from '@potentiel-domain/projet';

import { TimelineItemBase, TimelineItemBaseProps } from './TimelineItemBase';
import { TimelineItemFile } from './TimelineItemFile';

export type TimelineItemProps = Omit<TimelineItemBaseProps, 'children'> & {
  details?: ReactNode;
  file?: { document: DocumentProjet.ValueType; ariaLabel: string; label?: string };
  redirect?: { label: string; url: string; ariaLabel: string };
};

export const TimelineItem: FC<TimelineItemProps> = ({
  date,
  title,
  actor,
  details,
  type,
  status,
  icon,
  isLast,
  file,
}) => {
  return (
    <TimelineItemBase
      date={date}
      actor={actor}
      title={title}
      type={type}
      status={status}
      icon={icon}
      isLast={isLast}
    >
      {details && <div className={clsx(title && 'mt-2')}>{details}</div>}
      {file && (
        <TimelineItemFile document={file.document} label={file.label} ariaLabel={file.ariaLabel} />
      )}
    </TimelineItemBase>
  );
};
