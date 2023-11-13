import React from 'react';

import { ExclamationIcon } from '../..';

export const WarningIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="alerte">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">alerte</div>
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-warning-425-base rounded-full group-hover:bg-warning-425-hover print:bg-transparent print:border-solid print:border-2 print:border-warning-425-base'
      }
    >
      <ExclamationIcon className="h-6 w-6 text-white print:text-warning-425-base" />
    </span>
  </div>
);
