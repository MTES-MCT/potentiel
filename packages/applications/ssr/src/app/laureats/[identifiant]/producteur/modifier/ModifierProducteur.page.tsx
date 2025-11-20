import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import { ModifierProducteurForm, ModifierProducteurFormProps } from './ModifierProducteur.form';

export type ModifierProducteurPageProps = ModifierProducteurFormProps;

export const ModifierProducteurPage: FC<ModifierProducteurPageProps> = ({
  identifiantProjet,
  producteur,
}) => (
  <>
    <Heading1>Changer le producteur</Heading1>
    <ModifierProducteurForm identifiantProjet={identifiantProjet} producteur={producteur} />
  </>
);
