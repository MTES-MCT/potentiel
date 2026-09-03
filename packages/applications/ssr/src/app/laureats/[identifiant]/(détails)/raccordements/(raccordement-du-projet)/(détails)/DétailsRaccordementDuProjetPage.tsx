import type { IdentifiantProjet } from '@potentiel-domain/projet';

<<<<<<< Updated upstream
import { Heading1 } from '@/components/atoms/headings';
import { Icon } from '@/components/atoms/Icon';
import { PageTemplate } from '@/components/templates/Page.template';
=======
import { SectionPage } from '@/components/atoms/section/SectionPage';
>>>>>>> Stashed changes
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  estProjetAchevé: boolean;
};

<<<<<<< Updated upstream
export const DétailsRaccordementDuProjetPage = ({ identifiantProjet, estProjetAchevé }: Props) => {
  return (
    <PageTemplate>
      <TitrePageRaccordement />
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

const TitrePageRaccordement = () => (
  <Heading1 className="flex items-center gap-1">
    <Icon id="ri-plug-line" size="lg" />
    Raccordement
  </Heading1>
=======
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
>>>>>>> Stashed changes
);
