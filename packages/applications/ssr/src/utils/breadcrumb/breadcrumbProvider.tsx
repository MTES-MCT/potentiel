'use client';

import { useState } from 'react';

import { BreadcrumbContext, type BreadcrumbProps } from './breadcrumbContext';

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbProps, setBreadcrumbProps] = useState<BreadcrumbProps>();

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbProps,
        setBreadcrumbProps,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
