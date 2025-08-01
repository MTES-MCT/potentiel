import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierReprésentantLégalForm } from './ModifierReprésentantLégal.form';

export type ModifierReprésentantLégalPageProps =
  PlainType<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel>;
export const ModifierReprésentantLégalPage: FC<ModifierReprésentantLégalPageProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Modifier le représentant légal</Heading1>
    <ModifierReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      nomReprésentantLégal={nomReprésentantLégal}
      typeReprésentantLégal={typeReprésentantLégal}
    />
  </PageTemplate>
);
