'use client';

import { FC } from 'react';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { Heading1 } from '@/components/atoms/headings';
import { ModifierGestionnaireRéseauForm } from './modifier/ModifierGestionnaireRéseauForm';

type ModifierGestionnaireRéseauProps = {
  identifiantGestionnaireRéseau: string;
  raisonSociale: string;
  expressionReguliere: string;
  format: string;
  légende: string;
};

export const ModifierGestionnaireRéseauPage: FC<ModifierGestionnaireRéseauProps> = (
  props: ModifierGestionnaireRéseauProps,
) => {
  return (
    <PageTemplate
      banner={
        <Heading1 className="text-white">
          Modifier le gestionnaire de réseau ({props.raisonSociale})
        </Heading1>
      }
    >
      <ModifierGestionnaireRéseauForm {...props} />
    </PageTemplate>
  );
};
