import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  CorrigerChangementReprésentantLégalForm,
  type CorrigerChangementReprésentantLégalFormProps,
} from './CorrigerChangementReprésentantLégal.form';

export type CorrigerChangementReprésentantLégalPageProps =
  CorrigerChangementReprésentantLégalFormProps;

export const CorrigerChangementReprésentantLégalPage: FC<
  CorrigerChangementReprésentantLégalPageProps
> = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  pièceJustificative,
  dateDemande,
}) => (
  <>
    <Heading1>Corriger une demande de changement de représentant légal</Heading1>
    <CorrigerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      typeReprésentantLégal={typeReprésentantLégal}
      nomReprésentantLégal={nomReprésentantLégal}
      pièceJustificative={pièceJustificative}
      dateDemande={dateDemande}
    />
  </>
);
