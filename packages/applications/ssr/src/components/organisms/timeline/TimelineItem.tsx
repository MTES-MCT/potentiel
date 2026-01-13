import { FC, ReactNode } from 'react';
import MuiTimelineItem from '@mui/lab/TimelineItem';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import clsx from 'clsx';
import Button from '@codegouvfr/react-dsfr/Button';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { Icon, IconProps } from '../../atoms/Icon';
import { FormattedDate } from '../../atoms/FormattedDate';

import { TimelineItemTitle, TimelineItemTitleProps } from './TimelineItemTitle';

export const ETAPE_INCONNUE_TITLE = 'Étape inconnue';

export type TimelineItemProps = {
  status?: 'error' | 'success' | 'warning' | 'info';
  title: TimelineItemTitleProps['title'];
  actor?: TimelineItemTitleProps['actor'];
  type?: string;
  details?: ReactNode;
  date: Iso8601DateTime;
  icon?: IconProps;
  isLast?: true;
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
  redirect,
}) => {
  const isÉtapeInconnue = title === ETAPE_INCONNUE_TITLE;

  return (
    <MuiTimelineItem
      sx={{
        minHeight: '50',
      }}
    >
      <TimelineOppositeContent>
        <div className={clsx('font-bold', icon && 'pt-3')}>
          <FormattedDate date={date} />
        </div>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          color={
            status === 'error' || isÉtapeInconnue
              ? 'error'
              : status === 'success'
                ? 'success'
                : status === 'warning'
                  ? 'warning'
                  : status === 'info'
                    ? 'info'
                    : 'grey'
          }
        >
          {icon && <Icon id={icon.id} size="md" className="print:text-theme-black" />}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent
        color={isÉtapeInconnue ? 'error' : undefined}
        sx={{
          alignContent: 'flex-start',
        }}
      >
        <div className={clsx(icon && 'pt-3')}>
          <TimelineItemTitle title={title} actor={actor} />
          {isÉtapeInconnue && type && ` (${type})`}
          {details ? <div className={clsx(title && 'mt-2')}>{details}</div> : null}
          {file ? (
            <DownloadDocument
              className="mb-0"
              label={file.label ?? 'Télécharger le document joint'}
              ariaLabel={file.ariaLabel}
              format="pdf"
              url={Routes.Document.télécharger(file.document.formatter())}
            />
          ) : null}
          {redirect ? (
            <Button
              priority="secondary"
              linkProps={{
                href: redirect.url,
              }}
              aria-label={redirect.ariaLabel}
            >
              {redirect.label}
            </Button>
          ) : null}
        </div>
      </TimelineContent>
    </MuiTimelineItem>
  );
};
