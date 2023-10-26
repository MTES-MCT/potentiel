import React from 'react';

export const CurrentIcon = () => (
  <div className="flex flex-col print:min-w-[90px]" title="étape à valider">
    <div className="hidden print:block text-xs mb-2 whitespace-nowrap">étape à valider</div>
    <span
      className={
        'relative z-2 w-8 h-8 flex items-center justify-center bg-white print:bg-none border-2 border-solid rounded-full border-blue-700 group-hover:border-blue-900'
      }
    >
      <span
        className={
          'h-2.5 w-2.5 rounded-full bg-blue-700 print:bg-transparent print:h-0 print:w-0 print:border-solid print:border-4 print:border-blue-700'
        }
      />
    </span>
  </div>
);
