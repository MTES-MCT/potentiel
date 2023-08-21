import React from 'react';

import { ClockIcon } from '../..';

export const NextUpIcon = () => (
  <div className="h-9 flex items-center">
    <span
      className={'relative z-2 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full'}
    >
      <ClockIcon className="h-5 w-5 text-white" title="étape à venir" />
    </span>
  </div>
);
