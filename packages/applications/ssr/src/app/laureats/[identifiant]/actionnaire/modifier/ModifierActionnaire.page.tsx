import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  ModifierActionnaireForm,
  type ModifierActionnaireFormProps,
} from './ModifierActionnaire.form';

export type ModifierActionnairePageProps = ModifierActionnaireFormProps;

export const ModifierActionnairePage: FC<ModifierActionnairePageProps> = ({
  identifiantProjet,
  actionnaire,
}) => (
  <>
    <Heading1>Changer d'actionnaire(s)</Heading1>
    <ModifierActionnaireForm identifiantProjet={identifiantProjet} actionnaire={actionnaire} />
  </>
);
