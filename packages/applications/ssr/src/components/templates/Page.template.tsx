'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import ScrollToTop from '@/components/molecules/ScrollToTop';
import { FormSuccessAlert } from '@/components/atoms/form/FormSuccessAlert';

type PageTemplateProps = {
  banner?: React.ReactNode;
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, children }) => {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');

  return (
    <>
      {banner && (
        <div className="text-theme-white py-6 mb-3 bg-theme-blueFrance">
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10">
        {successMessage && (
          <>
            <ScrollToTop />
            <FormSuccessAlert message={successMessage} />
          </>
        )}
        {children}
      </div>
    </>
  );
};
