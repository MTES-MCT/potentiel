import React from 'react';

type TimelineItemProps = {
  children?: any;
  isLastItem: boolean;
};

export const TimelineItem = ({ children, isLastItem }: TimelineItemProps) => (
  <li className={classNames(isLastItem ? '' : 'pb-6 print:pb-3', 'relative')}>
    {isLastItem ? null : (
      <div
        className="print:hidden -ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 "
        aria-hidden="true"
      />
    )}
    <div className="relative flex items-start group">{children}</div>
  </li>
);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
