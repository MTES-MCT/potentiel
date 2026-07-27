import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  ModifierGestionnaireRéseauRaccordementForm,
  type ModifierGestionnaireRéseauRaccordementFormProps,
} from './ModifierGestionnaireRéseauRaccordement.form';

export type ModifierGestionnaireRéseauRaccordementPageProps = {
  identifiantProjet: ModifierGestionnaireRéseauRaccordementFormProps['identifiantProjet'];
  gestionnaireRéseauActuel: ModifierGestionnaireRéseauRaccordementFormProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: ModifierGestionnaireRéseauRaccordementFormProps['listeGestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ identifiantProjet, gestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <PageTemplate>
    <div className="flex flex-col gap-4">
      <ModifierGestionnaireRéseauRaccordementForm
        identifiantProjet={identifiantProjet}
        gestionnaireRéseauActuel={gestionnaireRéseauActuel}
        listeGestionnairesRéseau={listeGestionnairesRéseau}
      />
      <Notice
        severity="info"
        title=""
        description="La modification de cette information sera appliquée à tous les dossiers de raccordements du projet."
      />
    </div>
  </PageTemplate>
);
