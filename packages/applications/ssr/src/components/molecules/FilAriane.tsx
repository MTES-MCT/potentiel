'use client';

import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';

import { useBreadcrumb } from '@/utils/breadcrumb/breadcrumbContext';

export const FilAriane = () => {
  const { breadcrumbProps } = useBreadcrumb();
  return (
    breadcrumbProps && (
      <Breadcrumb
        currentPageLabel={breadcrumbProps.currentPagelabel}
        homeLinkProps={{
          href: '/',
        }}
        segments={breadcrumbProps.parentSegments.map((segment) => ({
          label: segment.label,
          linkProps: {
            href: segment.href,
          },
        }))}
      />
    )
  );
};
