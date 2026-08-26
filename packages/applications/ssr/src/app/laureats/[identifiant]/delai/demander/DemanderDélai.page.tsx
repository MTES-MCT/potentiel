import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
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
        <Notice
          severity="info"
          title=""
          description={
            <div>
              La date d'achèvement prévisionnel actuelle est{' '}
              <FormattedDate
                date={Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
                  dateAchèvementPrévisionnelActuelle,
                ).formatter()}
                className="font-semibold"
              />
            </div>
          }
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
