import React from 'react'
import { dataId } from '../../helpers/testId'
import { Pagination } from '../../types'

interface PaginationProps {
  pageCount: number
  pagination: Pagination
  itemTitle: string
}

export function PaginationPanel({
  pageCount,
  pagination: { pageSize, page },
  itemTitle,
}: PaginationProps) {
  const pageNumbers = [0, 1]
  if (pageCount <= 5) {
    pageNumbers.push(2, 3, 4)
  } else {
    if (page > 1 && page < pageCount - 2) {
      if (page > 2) {
        pageNumbers.push(-1) // Will be "..."
      }

      pageNumbers.push(page)

      if (page < pageCount - 3) {
        pageNumbers.push(-1) // Will be "..."
      }
    } else {
      pageNumbers.push(2, -1)
    }

    pageNumbers.push(pageCount - 2, pageCount - 1)
  }

  return (
    <nav className="pagination">
      <div className="pagination__display-group">
        <label htmlFor="pagination__display" className="pagination__display-label">
          {itemTitle} par page
        </label>
        <select
          className="pagination__display"
          id="pagination__display"
          {...dataId('pageSizeSelector')}
          defaultValue={pageSize}
        >
          {[5, 10, 20, 50, 100].map((count) => (
            <option key={'select_pageSize_' + count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination__count">
        Page <strong>{page + 1}</strong> sur <strong>{pageCount}</strong>
      </div>
      <ul className="pagination__pages">
        {page > 0 ? (
          <li>
            <a {...dataId('goToPage')} data-pagevalue={page - 1}>
              ❮ Précédent
            </a>
          </li>
        ) : (
          ''
        )}

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === -1 ? (
            <li key={'goToPage_' + index} className="disabled">
              ...
            </li>
          ) : (
            <li
              key={'goToPage_' + index}
              className={pageNumber === page ? 'active' : pageNumber >= pageCount ? 'disabled' : ''}
            >
              <a {...dataId('goToPage')} data-pagevalue={pageNumber}>
                {pageNumber + 1}
              </a>
            </li>
          )
        )}
        {page + 1 < pageCount ? (
          <li>
            <a {...dataId('goToPage')} data-pagevalue={page + 1}>
              Suivant ❯
            </a>
          </li>
        ) : (
          ''
        )}
      </ul>
    </nav>
  )
}
