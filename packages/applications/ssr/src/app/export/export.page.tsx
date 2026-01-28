import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ListFilters, ListFiltersProps } from '@/components/molecules/ListFilters';

export type ExportPageProps = {
  actions: Array<{
    type: 'exporter-raccordement' | 'lister-lauréat-enrichi' | 'lister-éliminé-enrichi';
    label: string;
    url: string;
  }>;
  filters: ListFiltersProps['filters'];
};

export const ExportPage: FC<ExportPageProps> = ({ actions, filters }) => (
  <PageTemplate banner={<Heading1>Exporter des données</Heading1>} feature={'export'}>
    <div className="flex flex-col md:flex-row gap-5 md:gap-10">
      <div className="flex flex-col gap-3 pb-2 md:w-1/4">
        <ListFilters filters={filters} />
      </div>

      <ul className={'md:w-3/4 flex flex-col gap-3 flex-grow mt-8'}>
        {actions.map((action) => (
          <li key={action.type}>
            <DownloadDocument label={action.label} url={action.url} format="csv" />
          </li>
        ))}
      </ul>
    </div>
  </PageTemplate>
);
