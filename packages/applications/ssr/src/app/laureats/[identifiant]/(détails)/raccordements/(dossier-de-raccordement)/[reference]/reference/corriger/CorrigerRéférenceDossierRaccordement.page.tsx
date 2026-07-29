import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  CorrigerRéférenceDossierForm,
  type CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossierRaccordement.form';

export type CorrigerRéférenceDossierPageProps = CorrigerRéférenceDossierFormProps;

export const CorrigerRéférenceDossierPage: FC<CorrigerRéférenceDossierPageProps> = (props) => (
  <PageTemplate>
    <CorrigerRéférenceDossierForm
      dossierRaccordement={props.dossierRaccordement}
      gestionnaireRéseau={props.gestionnaireRéseau}
      identifiantProjet={props.identifiantProjet}
    />
  </PageTemplate>
);
