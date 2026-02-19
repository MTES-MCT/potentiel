import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '@/components/atoms/menu/SectionPage';

import { AutorisationUrbanismeSection } from './(sections)/AutorisationUrbanisme.section';
import { NatureDeLExploitationSection } from './(sections)/NatureDeLExploitation.section';
import { TypologieInstallationSection } from './(sections)/TypologieInstallation.section';
import { InstallateurSection } from './(sections)/Installateur.section';
import { DispositifDeStockageSection } from './(sections)/DispositifDeStockage.section';
import { AutorisationEnvironnementaleSection } from './(sections)/AutorisationEnvironnementale.section';

type Props = { identifiantProjet: IdentifiantProjet.RawType };

export const InstallationPage = ({ identifiantProjet }: Props) => (
  <SectionPage title="Installation">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <TypologieInstallationSection identifiantProjet={identifiantProjet} />
        <InstallateurSection identifiantProjet={identifiantProjet} />
        <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
        <AutorisationEnvironnementaleSection identifiantProjet={identifiantProjet} />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <DispositifDeStockageSection identifiantProjet={identifiantProjet} />
        <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
      </div>
    </div>
  </SectionPage>
);
