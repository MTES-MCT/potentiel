import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  ModifierTypologieInstallationForm,
  type ModifierTypologieInstallationFormProps,
} from './ModifierTypologieInstallation.form';

export type ModifierTypologieInstallationPageProps = ModifierTypologieInstallationFormProps;

export const ModifierTypologieInstallationPage: FC<ModifierTypologieInstallationPageProps> = ({
  identifiantProjet,
  typologieInstallation,
}) => (
  <>
    <Heading1>Modifier la typologie du projet</Heading1>
    <ModifierTypologieInstallationForm
      identifiantProjet={identifiantProjet}
      typologieInstallation={typologieInstallation}
    />
  </>
);
