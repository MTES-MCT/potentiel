import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { AjouterGestionnaireRéseauForm } from './AjouterGestionnaireRéseau.form';

export const AjouterGestionnaireRéseauPage: FC = () => (
  <PageTemplate banner={<Heading1>Ajouter un gestionnaire de réseau</Heading1>}>
    <AjouterGestionnaireRéseauForm />
  </PageTemplate>
);
