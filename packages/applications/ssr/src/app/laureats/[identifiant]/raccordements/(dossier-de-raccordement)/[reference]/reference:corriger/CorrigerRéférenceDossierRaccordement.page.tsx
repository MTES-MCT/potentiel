import type { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { InfoBoxRéférenceDossierRaccordement } from '../(demande-complète-raccordement)/InformationDemandeComplèteRaccordement';
import {
  CorrigerRéférenceDossierForm,
  type CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossierRaccordement.form';

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
      children: <InfoBoxRéférenceDossierRaccordement />,
    }}
  />
);
