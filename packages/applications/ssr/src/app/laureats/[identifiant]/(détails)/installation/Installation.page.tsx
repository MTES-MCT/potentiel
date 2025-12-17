import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '../(components)/SectionPage';

import { AutorisationUrbanismeSection } from './(sections)/(autorisation-d-urbanisme)/AutorisationUrbanisme.section';
import { NatureDeLExploitationSection } from './(sections)/(nature-de-l-exploitation)/NatureDeLExploitation.section';
import { TypologieInstallationSection } from './(sections)/(installation)/TypologieInstallation.section';
import { InstallateurSection } from './(sections)/(installation)/Installateur.section';
import { DispositifDeStockageSection } from './(sections)/(installation)/DispositifDeStockage.section';

type Props = { identifiantProjet: IdentifiantProjet.RawType };

export const InstallationPage = ({ identifiantProjet }: Props) => (
  <SectionPage title="Installation">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <TypologieInstallationSection identifiantProjet={identifiantProjet} />
        <InstallateurSection identifiantProjet={identifiantProjet} />
        <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <DispositifDeStockageSection identifiantProjet={identifiantProjet} />
        <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
      </div>
    </div>
  </SectionPage>
);
