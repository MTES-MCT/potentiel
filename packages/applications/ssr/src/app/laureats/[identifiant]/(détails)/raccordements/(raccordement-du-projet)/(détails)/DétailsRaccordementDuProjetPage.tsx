import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  estProjetAchevé: boolean;
};

export const DétailsRaccordementDuProjetPage = ({ identifiantProjet, estProjetAchevé }: Props) => {
  return (
    <PageTemplate>
      <Heading1>Raccordement</Heading1>
      <div className="my-2 md:my-4 flex flex-col gap-4">
        <div className="w-fit">
          <GestionnaireRéseauSection identifiantProjet={identifiantProjet} />
        </div>
        <DossiersRaccordementSection
          identifiantProjet={identifiantProjet}
          estProjetAchevé={estProjetAchevé}
        />
      </div>
    </PageTemplate>
  );
};
