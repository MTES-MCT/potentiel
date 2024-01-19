import { FC } from 'react';

import { ProjetPageTemplate, ProjetPageTemplateProps } from './ProjetPageTemplate';

type DetailsAboutProjetPageTemplateProps = {
  projet: ProjetPageTemplateProps['projet'];
  heading: React.ReactNode;
  details: React.ReactNode;
  actions?: React.ReactNode;
};

export const DetailsAboutProjetPageTemplate: FC<DetailsAboutProjetPageTemplateProps> = ({
  projet,
  heading,
  details,
  actions,
}) => (
  <ProjetPageTemplate projet={projet} heading={heading}>
    <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:gap-6">
      <div className={`flex-1 flex-col gap-6`}>{details}</div>
      {actions && <div className="flex flex-col w-full md:w-1/4 gap-4">{actions}</div>}
    </div>
  </ProjetPageTemplate>
);
