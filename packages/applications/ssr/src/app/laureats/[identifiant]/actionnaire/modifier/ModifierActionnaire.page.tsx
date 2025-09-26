import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
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
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer d'actionnaire(s)</Heading1>
    <ModifierActionnaireForm identifiantProjet={identifiantProjet} actionnaire={actionnaire} />
  </PageTemplate>
);
