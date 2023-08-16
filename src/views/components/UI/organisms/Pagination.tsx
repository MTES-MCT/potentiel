import React, { ComponentProps, FC } from 'react';
import { PreviousPageIcon, NextPageIcon, FirstPageIcon, LastPageIcon } from '../atoms';

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  currentUrl: string;
};

export const Pagination: FC<PaginationProps> = ({ pageCount, currentPage, currentUrl }) => {
  const firstPageUrl = new URL(currentUrl);
  firstPageUrl.searchParams.set('page', '1');

  const lastPageUrl = new URL(currentUrl);
  lastPageUrl.searchParams.set('page', pageCount.toString());

  const previousPageUrl = new URL(currentUrl);
  previousPageUrl.searchParams.set('page', (currentPage - 1).toString());

  const nextPageUrl = new URL(currentUrl);
  nextPageUrl.searchParams.set('page', (currentPage + 1).toString());

  return (
    <nav role="pagination" aria-label="Pagination">
      <ul className="flex list-none gap-3 m-0 my-0 mt-6 p-0">
        <li>
          <PageLink href={firstPageUrl.href} title="Première page" disabled={currentPage === 1}>
            <FirstPageIcon className="w-6 h-6" />
          </PageLink>
        </li>
        <li className="mr-auto">
          <PageLink
            href={previousPageUrl.href}
            title="Page précédente"
            disabled={currentPage - 1 <= 0}
          >
            <PreviousPageIcon className="w-6 h-6 mr-2" />
            <span className="hidden md:block">Précédent</span>
          </PageLink>
        </li>

        <li>
          <CurrentPageLink pageNumber={currentPage} /> / {pageCount}
        </li>

        <li className="ml-auto">
          <PageLink
            href={nextPageUrl.href}
            title="Page suivante"
            disabled={currentPage + 1 > pageCount}
          >
            <span className="hidden md:block">Suivant</span>
            <NextPageIcon className="w-6 h-6 ml-2" />
          </PageLink>
        </li>
        <li>
          <PageLink
            href={lastPageUrl.href}
            title="Dernière page"
            disabled={currentPage === pageCount}
          >
            <LastPageIcon className="w-6 h-6" />
          </PageLink>
        </li>
      </ul>
    </nav>
  );
};

type PageLinkProps = ComponentProps<'a'> & {
  disabled: boolean;
};

const PageLink: FC<PageLinkProps> = ({ href, title, disabled, children }) => (
  <a
    className={`flex px-2 py-1 no-underline hover:no-underline focus:no-underline ${
      disabled
        ? 'cursor-not-allowed !text-grey-425-base hover:!text-grey-425-base'
        : 'hover:bg-grey-1000-hover focus:no-underline !text-black hover:text-black'
    }`}
    title={title}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role="link"
  >
    {children}
  </a>
);

const CurrentPageLink: FC<ComponentProps<'a'> & { pageNumber: number }> = ({ pageNumber }) => (
  <a
    role="link"
    aria-current="page"
    aria-disabled
    className="bg-blue-france-sun-base !text-white px-2 py-1"
  >
    {pageNumber}
  </a>
);
