import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import {
  CorrigerRéférenceDossierForm,
  type CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossierRaccordement.form';

export type CorrigerRéférenceDossierPageProps = CorrigerRéférenceDossierFormProps;

export const CorrigerRéférenceDossierPage: FC<CorrigerRéférenceDossierPageProps> = (props) => (
  <SectionPage title="Corriger une référence de dossier de raccordement">
    <CorrigerRéférenceDossierForm
      dossierRaccordement={props.dossierRaccordement}
      gestionnaireRéseau={props.gestionnaireRéseau}
      identifiantProjet={props.identifiantProjet}
    />
  </SectionPage>
);
