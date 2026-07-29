import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import {
  ModifierDemandeComplèteRaccordementForm,
  type ModifierDemandeComplèteRaccordementFormProps,
} from './ModifierDemandeComplèteRaccordement.form';

export type ModifierDemandeComplèteRaccordementPageProps =
  ModifierDemandeComplèteRaccordementFormProps;

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({ identifiantProjet, raccordement, gestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <PageTemplate>
    <ModifierDemandeComplèteRaccordementForm
      identifiantProjet={identifiantProjet}
      gestionnaireRéseauActuel={gestionnaireRéseauActuel}
      raccordement={raccordement}
      listeGestionnairesRéseau={listeGestionnairesRéseau}
    />
  </PageTemplate>
);
