import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';
import { ModifierReprésentantLégalForm } from './ModifierReprésentantLégal.form';

export type ModifierReprésentantLégalPageProps = PlainType<{
  nomReprésentantLégal: string;
  identifiantProjet: string;
}>;

export const ModifierReprésentantLégalPage: FC<ModifierReprésentantLégalPageProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
}) => (
  <>
    <Heading1>Modifier le représentant légal</Heading1>
    <ModifierReprésentantLégalForm
      identifiantProjet={identifiantProjet}
      nomReprésentantLégal={nomReprésentantLégal}
    />
  </>
);
