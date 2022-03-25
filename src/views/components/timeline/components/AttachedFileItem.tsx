import { PaperClipIcon } from '@heroicons/react/outline'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'
import { makeDocumentUrl } from '../helpers'
import { AttachedFileItemProps } from '../helpers/extractAttachedFileItemProps'

export const AttachedFileItem = (props: AttachedFileItemProps) => {
  const { date, title, description, files } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <div className="align-middle">
          <ItemDate date={date} />
        </div>
        <ItemTitle title={title} />
        {description && <span>{description}</span>}
        <ul className="list-none pl-0 mt-1">
          {files.map(({ id, name }) => (
            <li key={`fichier_${id}`}>
              <PaperClipIcon className="h-5 w-5 align-middle mr-1 text-gray-400" />
              <a href={makeDocumentUrl(id, name)} download>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </ContentArea>
    </>
  )
}
