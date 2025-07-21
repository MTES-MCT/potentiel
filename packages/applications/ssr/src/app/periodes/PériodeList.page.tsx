import { FC } from 'react';

import { RangeOptions } from '@potentiel-domain/entity';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

import { PériodeListItem, PériodeListItemProps } from './PériodeListItem';

export type PériodeListPageProps = {
  filters: ListPageTemplateProps<PériodeListItemProps>['filters'];
  périodes: ReadonlyArray<PériodeListItemProps>;
  range: RangeOptions;
  total: number;
};

export const PériodeListPage: FC<PériodeListPageProps> = ({ filters, périodes, range, total }) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  return (
    <ListPageTemplate
      heading="Périodes"
      actions={[]}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={total}
      filters={filters}
      ItemComponent={PériodeListItem}
      items={périodes.map((période) => ({
        ...période,
        key: `${période.appelOffre}#${période.période}`,
      }))}
    />
  );
};
