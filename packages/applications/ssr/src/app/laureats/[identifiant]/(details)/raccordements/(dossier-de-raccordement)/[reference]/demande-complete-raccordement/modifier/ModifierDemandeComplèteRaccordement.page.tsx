import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import {
  ModifierDemandeComplèteRaccordementForm,
  type ModifierDemandeComplèteRaccordementFormProps,
} from './ModifierDemandeComplèteRaccordement.form';

export type ModifierDemandeComplèteRaccordementPageProps =
  ModifierDemandeComplèteRaccordementFormProps;

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({ identifiantProjet, raccordement, gestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <SectionPage title="Modifier une demande complète de raccordement">
    <ModifierDemandeComplèteRaccordementForm
      identifiantProjet={identifiantProjet}
      gestionnaireRéseauActuel={gestionnaireRéseauActuel}
      raccordement={raccordement}
      listeGestionnairesRéseau={listeGestionnairesRéseau}
    />
  </SectionPage>
);
