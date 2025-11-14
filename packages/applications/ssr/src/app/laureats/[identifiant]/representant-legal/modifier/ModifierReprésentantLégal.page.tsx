import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';

import { ModifierReprésentantLégalForm } from './ModifierReprésentantLégal.form';

export type ModifierReprésentantLégalPageProps =
  PlainType<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel>;
export const ModifierReprésentantLégalPage: FC<ModifierReprésentantLégalPageProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => (
  <>
    <Heading1>Modifier le représentant légal</Heading1>
    <ModifierReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      nomReprésentantLégal={nomReprésentantLégal}
      typeReprésentantLégal={typeReprésentantLégal}
    />
  </>
);
