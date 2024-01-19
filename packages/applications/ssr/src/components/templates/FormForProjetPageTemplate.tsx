import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetPageTemplate, ProjetPageTemplateProps } from './ProjetPageTemplate';

type FormForProjetPageTemplateProps = {
  projet: ProjetPageTemplateProps['projet'];
  heading: React.ReactNode;
  form: React.ReactNode;
  information?: React.ReactNode;
};

export const FormForProjetPageTemplate: FC<FormForProjetPageTemplateProps> = ({
  projet,
  heading,
  form,
  information,
}) => (
  <ProjetPageTemplate projet={projet} heading={heading}>
    <div className="flex flex-col md:flex-row gap-7">
      <div className="flex-1 mt-6">{form}</div>
      {information && (
        <div className="md:w-1/3 md:mx-auto">
          <Alert severity="info" small description={<div className="py-4">{information}</div>} />
        </div>
      )}
    </div>
  </ProjetPageTemplate>
);
