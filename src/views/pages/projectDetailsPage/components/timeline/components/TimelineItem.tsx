import React from 'react'

export const TimelineItem = (props: { children?: any; isLastItem: boolean }) => {
  const { children, isLastItem } = props
  return (
    <li className={classNames(isLastItem ? '' : 'pb-10', 'relative')}>
      {isLastItem ? null : (
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-green-700"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start group">{children}</div>
    </li>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
