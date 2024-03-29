import React from 'react';
import { XIcon } from '../..';

export const UnvalidatedStepIcon = () => (
  <div className="h-9 flex items-center" aria-hidden="true">
    <span className="relative z-2 w-8 h-8 flex items-center justify-center bg-red-700 rounded-full group-hover:bg-red-900">
      <XIcon className="w-5 h-5 text-white" />
    </span>
  </div>
);
