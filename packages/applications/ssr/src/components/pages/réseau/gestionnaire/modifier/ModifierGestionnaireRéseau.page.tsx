import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierGestionnaireRéseauForm } from './ModifierGestionnaireRéseau.form';

export type ModifierGestionnaireRéseauProps =
  PlainType<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;

export const ModifierGestionnaireRéseauPage: FC<ModifierGestionnaireRéseauProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement,
  contactEmail,
}) => {
  return (
    <PageTemplate
      banner={
        <Heading1 className="text-theme-white">
          Modifier le gestionnaire de réseau ({raisonSociale})
        </Heading1>
      }
    >
      <ModifierGestionnaireRéseauForm
        identifiantGestionnaireRéseau={identifiantGestionnaireRéseau}
        raisonSociale={raisonSociale}
        aideSaisieRéférenceDossierRaccordement={aideSaisieRéférenceDossierRaccordement}
        contactEmail={contactEmail}
      />
    </PageTemplate>
  );
};
