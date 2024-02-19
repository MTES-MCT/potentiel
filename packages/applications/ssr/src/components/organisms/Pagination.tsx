import React, { ComponentProps, FC } from 'react';

import { FirstPageIcon, LastPageIcon, NextPageIcon, PreviousPageIcon } from '../atoms/icons';

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  getPageUrl: (pageNumber: number) => string;
};

/**
 * @deprecated Ce composant est utilisé tant que l'issue https://github.com/codegouvfr/react-dsfr/issues/170
 * sur le composant `Pagination` du package @codegouvfr/react-dsfr ne sera pas résolue
 */
export const Pagination: FC<PaginationProps> = ({ pageCount, currentPage, getPageUrl }) => {
  return (
    <nav role="navigation" aria-label="Pagination navigation">
      <ul className="flex list-none gap-3 m-0 my-0 mt-6 p-0">
        <li>
          <PageLink href={getPageUrl(1)} title="Première page" disabled={currentPage === 1}>
            <FirstPageIcon className="w-6 h-6" />
          </PageLink>
        </li>
        <li className="mr-auto">
          <PageLink
            href={getPageUrl(currentPage - 1)}
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
            href={getPageUrl(currentPage + 1)}
            title="Page suivante"
            disabled={currentPage + 1 > pageCount}
          >
            <span className="hidden md:block">Suivant</span>
            <NextPageIcon className="w-6 h-6 ml-2" />
          </PageLink>
        </li>
        <li>
          <PageLink
            href={getPageUrl(pageCount)}
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
    className={`flex px-2 py-1 bg-none no-underline hover:no-underline focus:no-underline ${
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
    className="bg-decisions-background-active-blueFrance-default !text-white px-2 py-1"
  >
    {pageNumber}
  </a>
);
