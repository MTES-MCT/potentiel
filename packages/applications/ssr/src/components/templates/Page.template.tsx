import { fr } from '@codegouvfr/react-dsfr';
import { FC } from 'react';

type PageTemplateProps = {
  banner?: React.ReactNode;
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ banner, children }) => {
  return (
    <>
      {banner && (
        <div
          className="text-white py-6 mb-3"
          style={{
            backgroundColor: fr.colors.decisions.background.active.blueFrance.default,
          }}
        >
          <div className="fr-container">{banner}</div>
        </div>
      )}
      <div className="fr-container my-10">{children}</div>
    </>
  );
};
