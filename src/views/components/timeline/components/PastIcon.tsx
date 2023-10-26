import React from 'react';
import { CheckIcon } from '../..';

export const PastIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="étape validée">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">étape validée</div>
    <span className="relative z-2 w-8 h-8 flex items-center justify-center bg-green-700 print:bg-transparent print:border-solid print:border-2 print:border-green-700 rounded-full group-hover:bg-green-900">
      <CheckIcon className="w-5 h-5 text-white print:text-green-700" />
    </span>
  </div>
);
