import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { SignalerPPAForm, SignalerPPAFormProps } from './SignalerPPA.form';

export type SignalerPPAPageProps = SignalerPPAFormProps;

export const SignalerPPAPage: React.FC<SignalerPPAPageProps> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      heading={<Heading1>Signaler un PPA</Heading1>}
      leftColumn={{
        children: <SignalerPPAForm identifiantProjet={identifiantProjet} />,
      }}
      rightColumn={{ children: <></> }}
    />
  );
};
