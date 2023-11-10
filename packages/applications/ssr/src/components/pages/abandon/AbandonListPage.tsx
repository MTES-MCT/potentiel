'use client';

import { FC } from 'react';

import { PageTemplate } from '../../templates/PageTemplate';
import { AbandonListFilters } from '../../molecules/abandon/AbandonListFilters';
import { AbandonListHeader } from '../../molecules/abandon/AbandonListHeader';
import { AbandonList } from '../../molecules/abandon/AbandonList';

type AbandonListPageProps = Parameters<typeof AbandonList>[0];

export const AbandonListPage: FC<AbandonListPageProps> = ({ abandons }) => {
  return (
    <PageTemplate heading="Abandon">
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0">
          <AbandonListFilters />
        </div>

        {abandons.items.length ? (
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <AbandonListHeader count={abandons.items.length} />
            </div>

            <AbandonList abandons={abandons} />
          </div>
        ) : (
          <div className="flex flex-grow">Aucun abandon à afficher</div>
        )}
      </div>
    </PageTemplate>
  );
};
