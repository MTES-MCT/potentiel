import { ComponentProps, FC } from 'react';

import { Icon } from '../atoms/Icon';

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
  const shouldSuivantBeHidden = currentPage === pageCount;
  const shouldPrecedentBeHidden = currentPage === 1;

  return (
    <nav role="navigation" aria-label="Pagination navigation">
      <ul className="flex list-none gap-3 m-0 my-0 mt-6 p-0">
        {shouldPrecedentBeHidden ? (
          <div className="mr-auto"></div>
        ) : (
          <>
            <li>
              <PageLink href={getPageUrl(1)} title="Première page">
                <Icon id="fr-icon-arrow-left-s-first-line" />
              </PageLink>
            </li>
            <li className="mr-auto">
              <PageLink href={getPageUrl(currentPage - 1)} title="Page précédente">
                <Icon id="fr-icon-arrow-left-s-line" />
                <span className="hidden md:block">Précédent</span>
              </PageLink>
            </li>
          </>
        )}

        <li>
          <CurrentPageLink pageNumber={currentPage} /> / {pageCount}
        </li>

        {shouldSuivantBeHidden ? (
          <div className="ml-auto"></div>
        ) : (
          <>
            <li className="ml-auto">
              <PageLink href={getPageUrl(currentPage + 1)} title="Page suivante">
                <span className="hidden md:block">Suivant</span>
                <Icon id="fr-icon-arrow-right-s-line" />
              </PageLink>
            </li>
            <li>
              <PageLink href={getPageUrl(pageCount)} title="Dernière page">
                <Icon id="fr-icon-arrow-right-s-last-line" />
              </PageLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

type PageLinkProps = ComponentProps<'a'> & {
  disabled?: boolean;
};

const PageLink: FC<PageLinkProps> = ({ href, title, disabled, children }) => (
  <a
    className={`flex px-2 py-1 bg-none no-underline hover:no-underline focus:no-underline ${
      disabled
        ? 'cursor-not-allowed !text-theme-grey hover:text-theme-grey'
        : 'focus:no-underline !text-theme-black hover:text-theme-black'
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
    className="!text-theme-white px-2 py-1 bg-theme-blueFrance"
  >
    {pageNumber}
  </a>
);
