import { FC } from 'react';
import { Heading1 } from '../atoms/headings';

type PageTemplateProps = {
  heading?: string;
  children: React.ReactNode;
};

export const PageTemplate: FC<PageTemplateProps> = ({ heading, children }) => {
  return (
    <>
      {heading && (
        <div className="bg-blue-france-sun-base text-white py-6 mb-3">
          <Heading1 className="text-white fr-container">{heading}</Heading1>
        </div>
      )}
      <div className="fr-container my-10">{children}</div>
    </>
  );
};
