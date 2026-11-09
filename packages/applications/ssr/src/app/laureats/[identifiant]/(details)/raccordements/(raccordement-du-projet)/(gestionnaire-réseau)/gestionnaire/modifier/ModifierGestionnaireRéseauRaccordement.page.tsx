import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
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
  <SectionPage title="Modifier le gestionnaire de réseau du projet">
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
  </SectionPage>
);
