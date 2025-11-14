import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierGestionnaireRéseauForm,
  ModifierGestionnaireRéseauFormProps,
} from './ModifierGestionnaireRéseau.form';

export type ModifierGestionnaireRéseauPageProps = ModifierGestionnaireRéseauFormProps;

export const ModifierGestionnaireRéseauPage: FC<ModifierGestionnaireRéseauPageProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement,
  contactEmail,
}) => {
  return (
    <PageTemplate banner={<Heading1>Modifier le gestionnaire de réseau {raisonSociale}</Heading1>}>
      <ModifierGestionnaireRéseauForm
        identifiantGestionnaireRéseau={identifiantGestionnaireRéseau}
        raisonSociale={raisonSociale}
        aideSaisieRéférenceDossierRaccordement={aideSaisieRéférenceDossierRaccordement}
        contactEmail={contactEmail}
      />
    </PageTemplate>
  );
};
