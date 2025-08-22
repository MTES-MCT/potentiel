import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
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
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Corriger une demande de changement de représentant légal</Heading1>
    <CorrigerChangementReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      typeReprésentantLégal={typeReprésentantLégal}
      nomReprésentantLégal={nomReprésentantLégal}
      pièceJustificative={pièceJustificative}
      dateDemande={dateDemande}
    />
  </PageTemplate>
);
