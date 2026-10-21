import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  ModifierProducteurForm,
  type ModifierProducteurFormProps,
} from './ModifierProducteur.form';

export type ModifierProducteurPageProps = ModifierProducteurFormProps;

export const ModifierProducteurPage: FC<ModifierProducteurPageProps> = ({
  identifiantProjet,
  producteur,
  numéroIdentification,
}) => (
  <PageTemplate>
    <Heading1>Modifier le producteur</Heading1>
    <ModifierProducteurForm
      identifiantProjet={identifiantProjet}
      producteur={producteur}
      numéroIdentification={numéroIdentification}
    />
  </PageTemplate>
);
