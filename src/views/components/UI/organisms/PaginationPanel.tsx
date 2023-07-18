import React from 'react';
import { updateUrlParams } from '@views/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@components';

interface Props {
  titreItems: string;
  nombreDePage: number;
  limiteParPage: number;
  pageCourante: number;
  paginationUrl: string;
}

function getPaginationUrls({
  paginationUrl,
  pageCourante,
  nombreDePage,
}: {
  paginationUrl: Props['paginationUrl'];
  pageCourante: Props['pageCourante'];
  nombreDePage: Props['nombreDePage'];
}) {
  const url = new URL(paginationUrl);
  let prevUrl: string | null = null;
  let nextUrl: string | null = null;

  if (pageCourante - 1 > 0) {
    const paramPrevUrl = new URLSearchParams(url.search);
    paramPrevUrl.set('page', (pageCourante - 1).toString());
    prevUrl = new URL(`${url.origin}${url.pathname}?${paramPrevUrl.toString()}`).href;
  }

  if (pageCourante + 1 <= nombreDePage) {
    const paramNextUrl = new URLSearchParams(url.search);
    paramNextUrl.set('page', (pageCourante + 1).toString());
    nextUrl = new URL(`${url.origin}${url.pathname}?${paramNextUrl}`).href;
  }
  return { prevUrl, nextUrl };
}

export function PaginationPanel({
  nombreDePage,
  titreItems,
  limiteParPage,
  pageCourante,
  paginationUrl,
}: Props) {
  const limitePageOptions = [5, 10, 20, 50, 100];

  let { prevUrl, nextUrl }: { prevUrl: string | null; nextUrl: string | null } = getPaginationUrls({
    paginationUrl,
    pageCourante,
    nombreDePage,
  });

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
            updateUrlParams({ pageSize: event.target.value });
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
        <nav aria-label="Pagination">
          <ul className={`m-0 p-0 list-none overflow-hidden flex items-center`}>
            <li>
              {prevUrl ? (
                <a
                  className={`flex items-center px-2 py-1 no-underline hover:no-underline focus:no-underline text-black hover:text-black  hover:bg-grey-975-base focus:bg-grey-975-base`}
                  title="Page précédente"
                  href={prevUrl}
                >
                  <ChevronLeftIcon className="mr-2" />
                  <span className="hidden md:block">Précédent</span>
                </a>
              ) : (
                <p
                  className="flex items-center cursor-not-allowed text-grey-625-base mr-4"
                  aria-disabled="true"
                >
                  <ChevronLeftIcon className="mr-2" />
                  <span className="hidden md:block">Précédent</span>
                </p>
              )}
            </li>

            <li>
              Page <strong>{pageCourante}</strong> sur <strong>{nombreDePage}</strong>
            </li>

            <li>
              {nextUrl ? (
                <a
                  className={`flex items-center px-2 py-1 no-underline hover:no-underline focus:no-underline text-black hover:text-black hover:bg-grey-975-base focus:bg-grey-975-base`}
                  title="Page suivante"
                  href={nextUrl}
                >
                  <span className="hidden md:block">Suivant</span>
                  <ChevronRightIcon className="ml-2" />
                </a>
              ) : (
                <p
                  className="flex items-center cursor-not-allowed text-grey-625-base ml-4"
                  aria-disabled="true"
                >
                  <span className="hidden md:block">Suivant</span>
                  <ChevronRightIcon className="ml-2" />
                </p>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
