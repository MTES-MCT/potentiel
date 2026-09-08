import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { InfoBoxDateAchèvementPrévisionnel } from '../InfoBoxDateAchèvementPrévisionnel';
import { InfoBoxDemandeDélai } from '../InfoBoxDemandeDélai';
import { DemanderDélaiForm, type DemanderDélaiFormProps } from './DemanderDélai.form';

export type DemanderDélaiPageProps = DemanderDélaiFormProps;

export const DemanderDélaiPage: FC<DemanderDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => (
  <ColumnPageTemplate
    heading={
      <>
        <Heading1>Demander un délai</Heading1>
        <InfoBoxDateAchèvementPrévisionnel
          dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
        />
      </>
    }
    leftColumn={{
      children: (
        <DemanderDélaiForm
          identifiantProjet={identifiantProjet}
          dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
        />
      ),
    }}
    rightColumn={{
      children: <InfoBoxDemandeDélai />,
    }}
  />
);
