import { FC } from 'react';
import { ProjetPageTemplate } from './ProjetPageTemplate';

type ProjetDetailsPageTemplateProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  heading: React.ReactNode;
  details: React.ReactNode;
  actions: React.ReactNode;
};

export const ProjetDetailsPageTemplate: FC<ProjetDetailsPageTemplateProps> = ({
  projet,
  heading,
  details,
  actions,
}) => (
  <ProjetPageTemplate projet={projet} heading={heading}>
    <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:gap-6">
      <div className="w-full md:w-3/4 flex flex-col gap-6">{details}</div>
      <div className="w-full md:w-1/4 flex flex-col gap-4">{actions}</div>
    </div>
  </ProjetPageTemplate>
);
