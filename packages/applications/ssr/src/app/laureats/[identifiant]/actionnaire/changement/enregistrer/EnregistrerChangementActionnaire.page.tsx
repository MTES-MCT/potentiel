import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  EnregistrerChangementActionnaireForm,
  type EnregistrerChangementActionnaireFormProps,
} from './EnregistrerChangementActionnaire.form';

export type EnregistrerChangementActionnairePageProps = EnregistrerChangementActionnaireFormProps;

export const EnregistrerChangementActionnairePage: FC<
  EnregistrerChangementActionnairePageProps
> = ({ identifiantProjet, actionnaire }) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer d'actionnaire(s)</Heading1>
    <EnregistrerChangementActionnaireForm
      identifiantProjet={identifiantProjet}
      actionnaire={actionnaire}
    />
  </PageTemplate>
);
