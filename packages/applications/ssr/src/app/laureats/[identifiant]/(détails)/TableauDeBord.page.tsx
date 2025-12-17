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
      <div
        className="flex flex-col md:grid md:grid-cols-2  gap-4"
        style={{
          gridTemplateAreas: `
            "etapes chiffres" 
            "etapes cdc" 
            "etapes achevement" 
            "raccordement achevement" 
            "raccordement gf"
            "raccordement 1fr"
          `,
        }}
      >
        <div className="[grid-area:etapes]">
          <ÉtapesProjetSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="[grid-area:chiffres]">
          <ChiffresClésSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="[grid-area:cdc]">
          <CahierDesChargesSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="[grid-area:achevement]">
          <AchèvementSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="[grid-area:raccordement]">
          <RaccordementSection identifiantProjet={identifiantProjet} />
        </div>
        <div className="[grid-area:gf]">
          <GarantiesFinancièresSection identifiantProjet={identifiantProjet} />
        </div>
      </div>
    </div>
  </SectionPage>
);
