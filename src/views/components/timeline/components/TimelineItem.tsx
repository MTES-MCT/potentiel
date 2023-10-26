import React from 'react';
import { PrintHidden } from '../../print';

type TimelineItemProps = {
  children?: any;
  isLastItem: boolean;
};

export const TimelineItem = ({ children, isLastItem }: TimelineItemProps) => (
  <li className={classNames(isLastItem ? '' : 'pb-6', 'relative')}>
    {isLastItem ? null : (
      <PrintHidden>
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 "
          aria-hidden="true"
        />
      </PrintHidden>
    )}
    <div className="relative flex items-start group">{children}</div>
  </li>
);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
