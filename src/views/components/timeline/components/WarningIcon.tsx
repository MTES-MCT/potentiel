import React from 'react';

import { ExclamationIcon } from "../..";

export const WarningIcon = () => (
  <div className="h-9 flex items-center">
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-warning-425-base rounded-full group-hover:bg-warning-425-hover'
      }
    >
      <ExclamationIcon className="h-6 w-6 text-white" title="alerte" />
    </span>
  </div>
);
