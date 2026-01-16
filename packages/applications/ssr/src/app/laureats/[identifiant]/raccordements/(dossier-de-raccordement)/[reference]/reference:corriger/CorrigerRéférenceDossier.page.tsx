import { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  CorrigerRéférenceDossierForm,
  CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossier.form';

export type CorrigerRéférenceDossierPageProps = CorrigerRéférenceDossierFormProps;

export const CorrigerRéférenceDossierPage: FC<CorrigerRéférenceDossierPageProps> = (props) => (
  <ColumnPageTemplate
    leftColumn={{
      children: (
        <CorrigerRéférenceDossierForm
          dossierRaccordement={props.dossierRaccordement}
          gestionnaireRéseau={props.gestionnaireRéseau}
          identifiantProjet={props.identifiantProjet}
        />
      ),
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
