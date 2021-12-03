import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

export const TimelineItem = (props: { children; isLastItem: boolean }) => {
  const mainColor = 'green'
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <li className={classNames(props.isLastItem ? '' : 'pb-10', 'relative')}>
      {props.isLastItem ? null : (
        <div
          className={'-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-' + mainColor + '-700'}
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start group">
        <span className="h-9 flex items-center">
          <span
            className={
              'relative z-10 w-8 h-8 flex items-center justify-center bg-' +
              mainColor +
              '-700 rounded-full group-hover:bg-' +
              mainColor +
              '-900'
            }
          >
            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
          </span>
        </span>
        <span className="ml-4 min-w-0 flex flex-col">{props.children}</span>
      </div>
    </li>
  )
}
