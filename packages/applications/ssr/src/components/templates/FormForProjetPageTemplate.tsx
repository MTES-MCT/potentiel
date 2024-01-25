import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetPageTemplate, ProjetPageTemplateProps } from './ProjetPageTemplate';

type FormForProjetPageTemplateProps = {
  projet: ProjetPageTemplateProps['projet'];
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
  <ProjetPageTemplate projet={projet} heading={heading}>
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 mt-6">{form}</div>
      {information && (
        <div className="flex md:max-w-lg items-stretch">
          <Alert
            severity="info"
            small
            title={information.title}
            description={<div className="py-4">{information.description}</div>}
          />
        </div>
      )}
    </div>
  </ProjetPageTemplate>
);
