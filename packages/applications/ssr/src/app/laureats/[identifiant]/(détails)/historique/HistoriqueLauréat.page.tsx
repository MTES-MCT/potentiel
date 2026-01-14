import { FC } from 'react';
import clsx from 'clsx';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ListFilters } from '@/components/molecules/ListFilters';
import { FiltersTagListProps } from '@/components/molecules/FiltersTagList';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { ImprimerButton } from '@/components/atoms/ImprimerButton';
import { TimelineItemBase } from '@/components/organisms/timeline/TimelineItemBase';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { SectionPage } from '../(components)/SectionPage';

export type HistoriqueLauréatAction = 'imprimer';

export type HistoriqueLauréatPageProps = {
  identifiantProjet: string;
  actions?: Array<HistoriqueLauréatAction>;
  filters: FiltersTagListProps['filters'];
  historique: Array<TimelineItemProps>;
};

export const HistoriqueLauréatPage: FC<HistoriqueLauréatPageProps> = ({
  actions,
  historique,
  filters,
}) => (
  <SectionPage title="Historique du projet">
    <div className="flex flex-col gap-6 w-full">
      <div className="flex lg:flex-row flex-col gap-4 w-full">
        {filters.length ? (
          <div className="print:hidden flex flex-col gap-1 w-max">
            <ListFilters filters={filters} />
          </div>
        ) : null}
        {actions?.includes('imprimer') && <ImprimerButton />}
      </div>
      <div className="flex flex-row gap-2">
        {historique.length > 0 ? (
          <Timeline items={historique} ItemComponent={HistoriqueLauréatTimelineItem} />
        ) : (
          <div className="w-full flex justify-center mt-4">
            <span>Aucun élément à afficher</span>
          </div>
        )}
      </div>
    </div>
  </SectionPage>
);

const HistoriqueLauréatTimelineItem: FC<TimelineItemProps> = ({
  details,
  file,
  redirect,
  ...props
}) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <TimelineItemBase {...props}>
      {details ? <div className={clsx(props.title && 'mt-2')}>{details}</div> : null}
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
    </TimelineItemBase>
  );
};
