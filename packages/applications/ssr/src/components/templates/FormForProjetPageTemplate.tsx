import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner, ProjetBannerProps } from '../molecules/projet/ProjetBanner';
import { Heading1 } from '../atoms/headings';

import { PageTemplate } from './PageTemplate';

export type FormForProjetPageTemplateProps = {
  projet: ProjetBannerProps;
  heading: React.ReactNode;
  form: React.ReactNode;
  information?: {
    description: React.ReactNode;
    title?: string;
  };
};

export const FormForProjetPageTemplate: FC<FormForProjetPageTemplateProps> = ({
  projet,
  heading,
  form,
  information,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <Heading1>{heading}</Heading1>
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 mt-6">{form}</div>
      {information && (
        <div className="flex md:max-w-lg items-stretch">
          <Alert
            severity="info"
            small
            title={information.title}
            description={<div className="py-4 text-justify">{information.description}</div>}
          />
        </div>
      )}
    </div>
  </PageTemplate>
);
