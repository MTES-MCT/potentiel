import React from 'react';
import { CheckIcon } from "../..";

export const PastIcon = () => (
  <div className="h-9 flex items-center">
    <span className="relative z-2 w-8 h-8 flex items-center justify-center bg-green-700 rounded-full group-hover:bg-green-900">
      <CheckIcon className="w-5 h-5 text-white" title="étape validée" />
    </span>
  </div>
);
