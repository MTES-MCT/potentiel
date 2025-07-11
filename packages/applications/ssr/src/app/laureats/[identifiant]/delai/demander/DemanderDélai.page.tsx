import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { DemanderDélaiForm, DemanderDélaiFormProps } from './DemanderDélai.form';

export type DemanderDélaiPageProps = DemanderDélaiFormProps;

export const DemanderDélaiPage: FC<DemanderDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />} feature="délai">
    <Heading1>Demander un délai</Heading1>
    <Alert
      description={
        <div>
          La date d'achèvement prévisionnel actuelle est{' '}
          <FormattedDate date={dateAchèvementPrévisionnelActuelle} className="font-semibold" />
        </div>
      }
      severity="info"
      small
    />
    <DemanderDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
    />
  </PageTemplate>
);
