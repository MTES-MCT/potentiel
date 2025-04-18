'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { FormSuccessAlert } from '@/components/atoms/form/FormSuccessAlert';

type PageTemplateProps = {
  banner?: React.ReactNode;
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, children }) => {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');
  const linkUrl = searchParams.get('linkUrl');
  const linkUrlLabel = searchParams.get('linkUrlLabel');

  return (
    <>
      {banner && (
        <div className="text-theme-white py-6 mb-3 bg-theme-blueFrance">
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10">
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
};
