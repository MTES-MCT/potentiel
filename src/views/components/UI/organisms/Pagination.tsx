import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Link } from '@components';

type PaginationProps = {
  nombreDePage: number;
  pageCourante: number;
  currentUrl: string;
};

const getcurrentUrls = ({ currentUrl, pageCourante, nombreDePage }: PaginationProps) => {
  const url = new URL(currentUrl);
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
};

export function Pagination({ nombreDePage, pageCourante, currentUrl }: PaginationProps) {
  const { prevUrl, nextUrl } = getcurrentUrls({
    currentUrl,
    pageCourante,
    nombreDePage,
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap mt-6">
      {nombreDePage > 1 && (
        <nav aria-label="Pagination" className="order-1 sm:order-2">
          <ul className={`p-2 list-none overflow-hidden flex items-center`}>
            <li>
              {prevUrl ? (
                <Link
                  className={`flex items-center no-underline hover:no-underline focus:no-underline !text-black hover:text-black`}
                  title="Page précédente"
                  href={prevUrl}
                >
                  <ChevronLeftIcon className="mr-2" />
                  Précédent
                </Link>
              ) : (
                <p
                  className="flex items-center cursor-not-allowed text-grey-625-base mr-4"
                  aria-disabled="true"
                >
                  <ChevronLeftIcon className="mr-2" />
                  Précédent
                </p>
              )}
            </li>

            <li className="mx-8">
              Page <strong>{pageCourante}</strong> sur <strong>{nombreDePage}</strong>
            </li>

            <li>
              {nextUrl ? (
                <Link
                  className={`flex items-center no-underline hover:no-underline focus:no-underline !text-black hover:text-black`}
                  title="Page suivante"
                  href={nextUrl}
                >
                  Suivant
                  <ChevronRightIcon className="ml-2" />
                </Link>
              ) : (
                <p
                  className="flex items-center cursor-not-allowed text-grey-625-base ml-4"
                  aria-disabled="true"
                >
                  Suivant
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
