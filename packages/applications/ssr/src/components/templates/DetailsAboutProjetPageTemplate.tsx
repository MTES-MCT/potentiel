import { FC } from 'react';
import { PageTemplate } from './PageTemplate';
import { ProjetBannerProps } from '../molecules/projet/ProjetBanner';

type DetailsAboutProjetPageTemplateProps = {
  projet: ProjetBannerProps;
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
  <PageTemplate type="projet" projet={projet} heading={heading}>
    <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:gap-6">
      <div className={`flex-1 flex-col gap-6`}>{details}</div>
      {actions && <div className="flex flex-col w-full md:w-1/4 gap-4">{actions}</div>}
    </div>
  </PageTemplate>
);
