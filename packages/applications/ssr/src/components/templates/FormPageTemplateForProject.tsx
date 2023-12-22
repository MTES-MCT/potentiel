import { FC } from 'react';
import { ProjetPageTemplate, ProjetPageTemplateProps } from './ProjetPageTemplate';
import Alert from '@codegouvfr/react-dsfr/Alert';

type FormPageTemplateForProjectProps = {
  projet: ProjetPageTemplateProps['projet'];
  heading: React.ReactNode;
  form: React.ReactNode;
  information?: React.ReactNode;
};

export const FormPageTemplateForProject: FC<FormPageTemplateForProjectProps> = ({
  projet,
  heading,
  form,
  information,
}) => (
  <ProjetPageTemplate projet={projet} heading={heading}>
    <div className="flex flex-col md:flex-row gap-7">
      <div className="mx-auto mt-6">{form}</div>
      {information && (
        <div className="md:w-1/3 md:mx-auto">
          <Alert
            severity="info"
            title="Informations"
            description={<div className="mt-3">{information}</div>}
          />
        </div>
      )}
    </div>
  </ProjetPageTemplate>
);
