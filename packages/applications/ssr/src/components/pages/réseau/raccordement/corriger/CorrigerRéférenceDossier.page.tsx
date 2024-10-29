import { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import {
  CorrigerRéférenceDossierForm,
  CorrigerRéférenceDossierFormProps,
} from './CorrigerRéférenceDossier.form';

export type CorrigerRéférenceDossierPageProps = CorrigerRéférenceDossierFormProps;

export const CorrigerRéférenceDossierPage: FC<CorrigerRéférenceDossierPageProps> = (props) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={props.identifiantProjet} />}
    leftColumn={{
      children: <CorrigerRéférenceDossierForm {...props} />,
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
