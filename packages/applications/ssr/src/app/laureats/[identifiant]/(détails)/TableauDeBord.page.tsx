import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from './(components)/SectionPage';
import { CahierDesChargesSection } from './(sections)/(cahier-des-charges)/CahierDesCharges.section';
import { RaccordementSection } from './(sections)/(raccordement)/Raccordement.section';
import { AchèvementSection } from './(sections)/(achèvement)/Achèvement.section';
import { GarantiesFinancièresSection } from './(sections)/(garanties-financières)/GarantiesFinancières.section';
import { ÉtapesProjetSection } from './(sections)/(étapes-projet)/ÉtapesProjet.section';
import { AlertesTableauDeBordSection } from './(sections)/(alertes)/AlertesTableauDeBord.section';
import { ChiffresClésSection } from './(sections)/ChiffresClés.section';

type TableauDeBordPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const TableauDeBordPage = ({ identifiantProjet }: TableauDeBordPageProps) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4">
      <AlertesTableauDeBordSection identifiantProjet={identifiantProjet} />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <ÉtapesProjetSection identifiantProjet={identifiantProjet} />
          <RaccordementSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <ChiffresClésSection identifiantProjet={identifiantProjet} />
          <CahierDesChargesSection identifiantProjet={identifiantProjet} />
          <AchèvementSection identifiantProjet={identifiantProjet} />
          <GarantiesFinancièresSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
    </div>
  </SectionPage>
);
