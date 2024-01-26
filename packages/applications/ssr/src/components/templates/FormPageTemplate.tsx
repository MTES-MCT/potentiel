import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { PageTemplate } from './PageTemplate';

type FormPageTemplateProps = {
  heading: React.ReactNode;
  form: React.ReactNode;
  information?: {
    description: React.ReactNode;
    title?: string;
  };
  children: React.ReactNode;
};

export const FormPageTemplate: FC<FormPageTemplateProps> = ({
  heading,
  form,
  information,
  children,
}) => (
  <PageTemplate
    banner={
      <div className="bg-blue-france-sun-base text-white py-6 mb-3">
        <div className="fr-container">{heading}</div>
      </div>
    }
  >
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
    {children}
  </PageTemplate>
);
