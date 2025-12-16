import { SectionPage } from './(components)/SectionPage';
import { CahierDesChargesSection } from './(sections)/(cahier-des-charges)/CahierDesCharges.section';
import { RaccordementSection } from './(sections)/(raccordement)/Raccordement.section';
import { AchèvementSection } from './(sections)/(achèvement)/Achèvement.section';
import { GarantiesFinancièresSection } from './(sections)/(garanties-financières)/GarantiesFinancières.section';
import { ÉtapesProjetSection } from './(sections)/(étapes-projet)/ÉtapesProjet.section';
import { AlertesTableauDeBordSection } from './(sections)/(alertes)/AlertesTableauDeBord.section.';

type TableauDeBordPageProps = {
  identifiantProjet: string;
};

export const TableauDeBordPage = ({ identifiantProjet }: TableauDeBordPageProps) => (
  <SectionPage title="Tableau de bord">
    <div className="flex flex-col gap-4">
      <AlertesTableauDeBordSection identifiantProjet={identifiantProjet} />
      <CahierDesChargesSection identifiantProjet={identifiantProjet} />
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <ÉtapesProjetSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <AchèvementSection identifiantProjet={identifiantProjet} />
          <RaccordementSection identifiantProjet={identifiantProjet} />
          <GarantiesFinancièresSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
    </div>
  </SectionPage>
);
