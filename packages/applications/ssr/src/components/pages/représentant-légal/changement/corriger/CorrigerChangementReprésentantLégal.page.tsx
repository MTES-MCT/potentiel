import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
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
> = ({ identifiantProjet, typeReprésentantLégal, nomReprésentantLégal, pièceJustificative }) => (
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
    />
  </PageTemplate>
);
