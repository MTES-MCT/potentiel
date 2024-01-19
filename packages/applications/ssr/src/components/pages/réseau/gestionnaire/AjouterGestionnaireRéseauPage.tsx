'use client';

import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/PageTemplate';

import { AjouterGestionnaireRéseauForm } from './ajouter/AjouterGestionnaireRéseauForm';

export const AjouterGestionnaireRéseauPage: FC = () => {
  return (
    <PageTemplate
      banner={<Heading1 className="text-white">Ajouter un gestionnaire de réseau</Heading1>}
    >
      <AjouterGestionnaireRéseauForm />
    </PageTemplate>
  );
};
