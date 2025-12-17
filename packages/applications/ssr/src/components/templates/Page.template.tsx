'use client';

import { FC } from 'react';
import { notFound, useSearchParams } from 'next/navigation';

import { FormSuccessAlert } from '@/components/atoms/form/FormSuccessAlert';
import { FeatureFlaggedComponent } from '@/utils/feature-flag/FeatureFlaggedComponent.template';

type PageTemplateProps = {
  children: React.ReactNode;
  banner?: React.ReactNode;
  feature?: string;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, children, feature }) => {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');
  const linkUrl = searchParams.get('linkUrl');
  const linkUrlLabel = searchParams.get('linkUrlLabel');

  const pageContent = (
    <>
      {banner && (
        <div className="text-theme-white py-6 mb-3 bg-theme-blueFrance">
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10 print:my-4">
        {successMessage && (
          <FormSuccessAlert
            message={successMessage}
            linkUrl={linkUrl}
            linkUrlLabel={linkUrlLabel}
          />
        )}
        {children}
      </div>
    </>
  );

  return feature ? (
    <FeatureFlaggedComponent feature={feature} isOff={notFound}>
      {pageContent}
    </FeatureFlaggedComponent>
  ) : (
    pageContent
  );
};
