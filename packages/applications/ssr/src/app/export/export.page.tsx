import { FC } from 'react';
import { Card } from '@codegouvfr/react-dsfr/Card';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { ListFilters, ListFiltersProps } from '@/components/molecules/ListFilters';

export type ExportPageProps = {
  actions: Array<{
    type:
      | 'exporter-raccordement'
      | 'exporter-fournisseur'
      | 'lister-lauréat-enrichi'
      | 'lister-éliminé-enrichi';
    label: string;
    url: string;
    description?: string;
  }>;
  filters: ListFiltersProps['filters'];
};

export const ExportPage: FC<ExportPageProps> = ({ actions, filters }) => (
  <PageTemplate banner={<Heading1>Exporter des données</Heading1>}>
    <div className="flex flex-col md:flex-row gap-5 md:gap-10">
      <div className="flex flex-col gap-3 pb-2 md:w-1/4">
        <ListFilters filters={filters} />
      </div>

      <ul className={'md:w-3/4 flex flex-col gap-3 flex-grow mt-8'}>
        {actions.map(({ type, label, url, description }) => (
          <li key={type}>
            <Card
              border
              linkProps={{ href: url }}
              size="small"
              enlargeLink
              endDetail="Format : CSV"
              title={<>{label}</>}
              desc={description}
            />
          </li>
        ))}
      </ul>
    </div>
  </PageTemplate>
);
