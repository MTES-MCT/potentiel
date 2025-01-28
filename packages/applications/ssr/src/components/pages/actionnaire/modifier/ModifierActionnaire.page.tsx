import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierActionnaireForm, ModifierActionnaireFormProps } from './ModifierActionnaire.form';

export type ModifierActionnairePageProps = ModifierActionnaireFormProps;

export const ModifierActionnairePage: FC<ModifierActionnairePageProps> = ({
  identifiantProjet,
  actionnaire,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer d'actionnaire(s)</Heading1>
    <ModifierActionnaireForm identifiantProjet={identifiantProjet} actionnaire={actionnaire} />
  </PageTemplate>
);
