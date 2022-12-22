import React, { ComponentProps, FC } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@components'

type Props = ComponentProps<'ul'> & {
  nombreDePage: number
  page: number
}

export const Pagination: FC<Props> = ({ nombreDePage, page, className = '', ...props }) => {
  const pageNumbers = [0, 1]

  if (nombreDePage <= 5) {
    pageNumbers.push(2, 3, 4)
  } else {
    if (page > 1 && page < nombreDePage - 2) {
      if (page > 2) {
        pageNumbers.push(-1) // Will be "..."
      }

      pageNumbers.push(page)

      if (page < nombreDePage - 3) {
        pageNumbers.push(-1) // Will be "..."
      }
    } else {
      pageNumbers.push(2, -1)
    }

    pageNumbers.push(nombreDePage - 2, nombreDePage - 1)
  }

  return (
    <ul className={`m-0 p-0 list-none overflow-hidden flex items-center ${className}`} {...props}>
      <li>
        {page <= 0 ? (
          <p className="flex items-center cursor-not-allowed text-grey-625-base mr-4">
            <ChevronLeftIcon className="mr-2" />
            Précédent
          </p>
        ) : (
          <a
            data-pagevalue={page - 1}
            className={`flex items-center no-underline hover:no-underline focus:no-underline text-black hover:text-black`}
          >
            <ChevronLeftIcon className="mr-2" />
            Précédent
          </a>
        )}
      </li>

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === -1 ? (
          <li key={'goToPage_' + index} className="disabled mx-2">
            ...
          </li>
        ) : (
          <li
            key={'goToPage_' + index}
            className={`mx-1 ${pageNumber >= nombreDePage ? 'disabled' : ''}`}
          >
            <a
              className={`bg-white py-1 px-3 inline-flex items-center no-underline text-black text-center ${
                pageNumber === page
                  ? 'bg-blue-france-sun-base text-white cursor-default'
                  : 'cursor-pointer'
              }`}
              data-pagevalue={pageNumber}
            >
              {pageNumber + 1}
            </a>
          </li>
        )
      )}

      <li>
        {page + 1 >= nombreDePage ? (
          <p className="flex items-center cursor-not-allowed text-grey-625-base ml-4">
            Suivant
            <ChevronRightIcon className="ml-2" />
          </p>
        ) : (
          <a
            data-pagevalue={page - 1}
            className={`flex items-center no-underline hover:no-underline focus:no-underline text-black hover:text-black`}
          >
            Suivant
            <ChevronRightIcon className="ml-2" />
          </a>
        )}
      </li>
    </ul>
  )
}
