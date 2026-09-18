'use client';

import { useEffect } from 'react';

import { type BreadcrumbProps, useBreadcrumb } from './breadcrumbContext';

export function BreadcrumbSetter({ breadcrumbProps }: { breadcrumbProps: BreadcrumbProps }) {
  const { setBreadcrumbProps } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbProps(breadcrumbProps);

    return () => {
      setBreadcrumbProps(undefined);
    };
  }, [breadcrumbProps, setBreadcrumbProps]);

  return null;
}
