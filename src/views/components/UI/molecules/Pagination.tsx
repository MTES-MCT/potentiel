import React, { ComponentProps, FC } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@components';
import { updateUrlParams } from '@views/helpers';

type Props = ComponentProps<'ul'> & {
  nombreDePage: number;
  page: number;
};

const handleKeyDown = ({
  event,
  page,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  page: number;
}) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    updateUrlParams({
      page: page.toString(),
    });
  }
};

export const Pagination: FC<Props> = ({ nombreDePage, page, className = '', ...props }) => {
  const pageNumbers = [0, 1];

  if (nombreDePage <= 5) {
    pageNumbers.push(2, 3, 4);
  } else {
    if (page > 1 && page < nombreDePage - 2) {
      if (page > 2) {
        pageNumbers.push(-1); // Will be "..."
      }

      pageNumbers.push(page);

      if (page < nombreDePage - 3) {
        pageNumbers.push(-1); // Will be "..."
      }
    } else {
      pageNumbers.push(2, -1);
    }
    pageNumbers.push(nombreDePage - 2, nombreDePage - 1);
  }

  return (
    <ul className={`m-0 p-0 list-none overflow-hidden flex items-center ${className}`} {...props}>
      <li>
        {page <= 0 ? (
          <p
            className="flex items-center cursor-not-allowed text-grey-625-base mr-4"
            aria-disabled="true"
          >
            <ChevronLeftIcon className="mr-2" />
            <span className="hidden md:block">Précédent</span>
          </p>
        ) : (
          <a
            tabIndex={0}
            className={`flex items-center px-2 py-1 no-underline hover:no-underline focus:no-underline text-black hover:text-black  hover:bg-grey-975-base focus:bg-grey-975-base`}
            title="Page précédente"
            onClick={() =>
              updateUrlParams({
                page: (page - 1).toString(),
              })
            }
            onKeyDown={(event) => handleKeyDown({ event, page: page - 1 })}
          >
            <ChevronLeftIcon className="mr-2" />
            <span className="hidden md:block">Précédent</span>
          </a>
        )}
      </li>

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === -1 ? (
          <li key={`goToPage_${index}`} className="disabled mx-2">
            ...
          </li>
        ) : (
          <li
            key={`goToPage_${index}`}
            className={`mx-1 ${pageNumber >= nombreDePage ? 'disabled' : ''}`}
          >
            <a
              className={`py-1 px-3 inline-flex items-center no-underline text-center ${
                pageNumber === page
                  ? 'bg-blue-france-sun-base text-white cursor-default hover:text-white focus:text-white'
                  : 'cursor-pointer text-black hover:bg-grey-975-base focus:bg-hrey-975-base hover:text-black focus:text-black'
              }`}
              {...(pageNumber === page
                ? { 'aria-current': 'page' }
                : { 'aria-label': `Aller à la page ${pageNumber + 1}`, tabIndex: 0 })}
              onClick={() => {
                if (pageNumber !== page) {
                  updateUrlParams({
                    page: pageNumber.toString(),
                  });
                }
              }}
              onKeyDown={(event) => handleKeyDown({ event, page: pageNumber })}
            >
              {pageNumber + 1}
            </a>
          </li>
        ),
      )}

      <li>
        {page + 1 >= nombreDePage ? (
          <p
            className="flex items-center cursor-not-allowed text-grey-625-base ml-4"
            aria-disabled="true"
          >
            <span className="hidden md:block">Suivant</span>
            <ChevronRightIcon className="ml-2" />
          </p>
        ) : (
          <a
            tabIndex={0}
            className={`flex items-center px-2 py-1 no-underline hover:no-underline focus:no-underline text-black hover:text-black hover:bg-grey-975-base focus:bg-grey-975-base`}
            title="Page suivante"
            onClick={() =>
              updateUrlParams({
                page: (page + 1).toString(),
              })
            }
            onKeyDown={(event) => handleKeyDown({ event, page: page + 1 })}
          >
            <span className="hidden md:block">Suivant</span>
            <ChevronRightIcon className="ml-2" />
          </a>
        )}
      </li>
    </ul>
  );
};
