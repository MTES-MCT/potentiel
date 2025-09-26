import { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import {
  CorrigerRéférenceDossierForm,
  CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossier.form';

export type CorrigerRéférenceDossierPageProps = CorrigerRéférenceDossierFormProps;

export const CorrigerRéférenceDossierPage: FC<CorrigerRéférenceDossierPageProps> = (props) => (
  <ColumnPageTemplate
    banner={<ProjetLauréatBanner identifiantProjet={props.identifiantProjet} />}
    leftColumn={{
      children: (
        <CorrigerRéférenceDossierForm
          dossierRaccordement={props.dossierRaccordement}
          gestionnaireRéseau={props.gestionnaireRéseau}
          identifiantProjet={props.identifiantProjet}
          lienRetour={props.lienRetour}
        />
      ),
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
