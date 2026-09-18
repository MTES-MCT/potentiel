'use client';

import { createContext, useContext } from 'react';

export type BreadcrumbProps =
  | {
      parentSegments: {
        label: string;
        href: string;
      }[];
      currentPagelabel: string;
    }
  | undefined;

type BreadcrumbContextValue = {
  breadcrumbProps?: BreadcrumbProps;
  setBreadcrumbProps: (props: BreadcrumbProps) => void;
};

export const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }

  return context;
}
