import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { InfoBoxDateAchèvementPrévisionnel } from '../../InfoBoxDateAchèvementPrévisionnel';
import {
  CorrigerDemandeDélaiForm,
  type CorrigerDemandeDélaiFormProps,
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
  <>
    <Heading1>Corriger la demande de délai</Heading1>
    <InfoBoxDateAchèvementPrévisionnel
      dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
    />
    <CorrigerDemandeDélaiForm
      identifiantProjet={identifiantProjet}
      dateAchèvementPrévisionnelActuelle={dateAchèvementPrévisionnelActuelle}
      dateDemande={dateDemande}
      nombreDeMois={nombreDeMois}
      pièceJustificative={pièceJustificative}
      raison={raison}
    />
  </>
);
