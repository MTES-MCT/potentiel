import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Lauréat } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading1 } from '@/components/atoms/headings';

import { InfoBoxDemandeDélai } from '../InfoBoxDemandeDélai';

import { DemanderDélaiForm, DemanderDélaiFormProps } from './DemanderDélai.form';

export type DemanderDélaiPageProps = DemanderDélaiFormProps;

export const DemanderDélaiPage: FC<DemanderDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={
      <>
        <Heading1>Demander un délai</Heading1>
        <Alert
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
          severity="info"
          small
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
