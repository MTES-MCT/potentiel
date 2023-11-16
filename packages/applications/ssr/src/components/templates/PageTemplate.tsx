import { FC } from 'react';

type PageTemplateProps = {
  banner?: React.ReactNode;
  retour?: { title: string; url: string };
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, retour, children }) => {
  return (
    <>
      {banner && (
        <div className="bg-blue-france-sun-base text-white py-6 mb-3">
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10">
        {retour && (
          <div className="flex justify-end">
            <a href={retour.url}>{retour.title}</a>
          </div>
        )}
        {children}
      </div>
    </>
  );
};
