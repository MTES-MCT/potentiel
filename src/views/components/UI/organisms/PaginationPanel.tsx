import React from 'react'
import { Pagination } from '../molecules/Pagination'
import { dataId } from '../../../../helpers/testId'

interface Props {
  nombreDePage: number
  pagination: {
    page: number
    limiteParPage: number
  }
  titreItems: string
}

export function PaginationPanel({
  nombreDePage,
  titreItems,
  pagination: { limiteParPage, page },
}: Props) {
  const pageNumbers = [0, 1]
  const limitePageOptions = [5, 10, 20, 50, 100]

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
    <div className="flex justify-between items-center flex-wrap mt-6">
      <div className="m-2">
        <label htmlFor="pagination__display" className="inline">
          {limiteParPage.toString()} {titreItems.toLowerCase()} par page
        </label>
        <select
          className="ml-2 py-1"
          id="pagination__display"
          defaultValue={limiteParPage}
          {...dataId('pageSizeSelector')}
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
  )
}
