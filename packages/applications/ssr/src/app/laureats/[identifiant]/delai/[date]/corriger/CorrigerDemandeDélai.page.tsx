import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { DateTime } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import {
  CorrigerDemandeDélaiForm,
  CorrigerDemandeDélaiFormProps,
} from './CorrigerDemandeDélai.form';

export type CorrigerDemandeDélaiPageProps = CorrigerDemandeDélaiFormProps;

export const CorrigerDemandeDélaiPage: FC<CorrigerDemandeDélaiPageProps> = ({
  identifiantProjet,
  dateAchèvementPrévisionnelActuelle,
  dateDemande,
  nombreDeMois,
  pièceJustificative,
  raison,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <Heading1>Corriger la demande de délai</Heading1>
    <Alert
      description={
        <div>
          La date d'achèvement prévisionnel actuelle est{' '}
          <FormattedDate
            date={DateTime.bind(dateAchèvementPrévisionnelActuelle.dateTime).formatter()}
            className="font-semibold"
          />
        </div>
      }
      severity="info"
      small
    />
    <CorrigerDemandeDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
      dateDemande={dateDemande}
      nombreDeMois={nombreDeMois}
      pièceJustificative={pièceJustificative}
      raison={raison}
    />
  </PageTemplate>
);
