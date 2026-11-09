import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import { AchèvementSection } from './(sections)/Achèvement.section';
import { AlertesTableauDeBordSection } from './(sections)/AlertesTableauDeBord.section';
import { CahierDesChargesSection } from './(sections)/CahierDesCharges.section';
import { ChiffresClésSection } from './(sections)/ChiffresClés.section';
import { GarantiesFinancièresSection } from './(sections)/GarantiesFinancières.section';
import { IdentifiantProjetSection } from './(sections)/IdentifiantProjet.section';
import { RaccordementSection } from './(sections)/Raccordement.section';
import { ÉtapesProjetSection } from './(sections)/ÉtapesProjet.section';

type TableauDeBordPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const TableauDeBordPage = ({ identifiantProjet }: TableauDeBordPageProps) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4 print:block print:space-y-4">
      <AlertesTableauDeBordSection identifiantProjet={identifiantProjet} />
      <div className="flex flex-col md:flex-row gap-4 print:block print:space-y-4">
        <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
          <ÉtapesProjetSection identifiantProjet={identifiantProjet} />
          <RaccordementSection identifiantProjet={identifiantProjet} />
          <IdentifiantProjetSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="flex flex-1 flex-col gap-4 print:block print:space-y-4">
          <ChiffresClésSection identifiantProjet={identifiantProjet} />
          <CahierDesChargesSection identifiantProjet={identifiantProjet} />
          <AchèvementSection identifiantProjet={identifiantProjet} />
          <GarantiesFinancièresSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
    </div>
  </SectionPage>
);
