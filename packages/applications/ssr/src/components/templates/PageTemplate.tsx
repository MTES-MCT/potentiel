import { FC } from 'react';

type PageTemplateProps = {
  banner?: React.ReactNode;
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, children }) => {
  return (
    <>
      {banner && (
        <div className="bg-blue-france-sun-base text-white py-6 mb-3">
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10">{children}</div>
    </>
  );
};
