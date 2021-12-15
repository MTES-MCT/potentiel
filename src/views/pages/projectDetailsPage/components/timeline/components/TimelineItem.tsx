import React from 'react'

export const TimelineItem = (props: { children?: any; isLastItem: boolean }) => {
  return (
    <li className={classNames(props.isLastItem ? '' : 'pb-10', 'relative')}>
      {props.isLastItem ? null : (
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-green-700"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start group">{props.children}</div>
    </li>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
