import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  estProjetAchevé: boolean;
};

export const DétailsRaccordementDuProjetPage = ({ identifiantProjet, estProjetAchevé }: Props) => (
  <SectionPage title="Raccordement">
    <div className="w-fit">
      <GestionnaireRéseauSection identifiantProjet={identifiantProjet} />
    </div>
    <DossiersRaccordementSection
      identifiantProjet={identifiantProjet}
      estProjetAchevé={estProjetAchevé}
    />
  </SectionPage>
);
