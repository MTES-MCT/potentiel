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
  dateAchèvementPrévisionnelleActuelle,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />} feature="délai">
    <Heading1>Demander un délai</Heading1>
    <Alert
      description={
        <div>
          La date d'achèvement prévisionnelle actuelle est{' '}
          <FormattedDate date={dateAchèvementPrévisionnelleActuelle} className="font-semibold" />
        </div>
      }
      severity="info"
      small
    />
    <DemanderDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelleActuelle={dateAchèvementPrévisionnelleActuelle}
    />
  </PageTemplate>
);
