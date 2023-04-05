import React from 'react';
import { Pagination } from '../molecules/Pagination';
import { updateUrlParams } from '@views/helpers';

interface Props {
  nombreDePage: number;
  pagination: {
    page: number;
    limiteParPage: number;
  };
  titreItems: string;
}

export function PaginationPanel({
  nombreDePage,
  titreItems,
  pagination: { limiteParPage, page },
}: Props) {
  const limitePageOptions = [5, 10, 20, 50, 100];

  return (
    <div className="flex justify-between items-center flex-wrap mt-6">
      <div className="m-2">
        <label htmlFor="pagination__display" className="inline">
          {limiteParPage.toString()} {titreItems.toLowerCase()} par page
        </label>
        <select
          className="ml-2 py-1"
          id="pagination__display"
          defaultValue={limiteParPage}
          onChange={(event) => {
            updateUrlParams({ pageSize: event.target.value, page: '0' });
          }}
        >
          {limitePageOptions.map((count) => (
            <option key={'select_limiteParPage_' + count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      {nombreDePage > 1 && (
        <>
          <div className="m-2">
            Page <strong>{page + 1}</strong> sur <strong>{nombreDePage}</strong>
          </div>
          <nav role="navigation" aria-label="Pagination">
            <Pagination nombreDePage={nombreDePage} page={page} />
          </nav>
        </>
      )}
    </div>
  );
}
