import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'
import { formatDate } from '../../../../helpers/formatDate'
import { ProjectEventDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'

export const TimelineItem = (props: {
  isLastItem: boolean
  event: ProjectEventDTO
  title: string
}) => {
  const mainColor = 'green'

  return (
    <li className={classNames(props.isLastItem ? '' : 'pb-10', 'relative')}>
      {props.isLastItem ? null : (
        <div
          className={'-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-' + mainColor + '-700'}
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start group">
        <span className="h-9 flex items-center" aria-hidden="true">
          <span
            className={
              'relative z-10 w-8 h-8 flex items-center justify-center bg-' +
              mainColor +
              '-700 rounded-full group-hover:bg-' +
              mainColor +
              '-900'
            }
          >
            <CheckIcon className="w-5 h-5 text-white" />
          </span>
        </span>
        <div className="ml-4 min-w-0 flex flex-col">
          <span className="text-sm font-semibold tracking-wide uppercase">
            {formatDate(props.event.date)}
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase">{props.title}</span>
        </div>
      </div>
    </li>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
