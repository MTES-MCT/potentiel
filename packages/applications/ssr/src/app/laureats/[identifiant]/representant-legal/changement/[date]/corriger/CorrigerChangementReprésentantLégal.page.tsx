import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  CorrigerChangementReprésentantLégalForm,
  CorrigerChangementReprésentantLégalFormProps,
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
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
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
