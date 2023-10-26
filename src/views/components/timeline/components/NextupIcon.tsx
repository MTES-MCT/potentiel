import React from 'react';

import { ClockIcon } from '../..';

export const NextUpIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="étape à venir">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">étape à venir</div>
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-gray-300 print:bg-none print:border-solid print:border-2 print:border-gray-400 rounded-full'
      }
    >
      <ClockIcon className="h-5 w-5 text-white print:text-gray-400" />
    </span>
  </div>
);
