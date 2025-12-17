import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { AutorisationUrbanismeSection } from './(sections)/(autorisation-d-urbanisme)/AutorisationUrbanisme.section';
import { InstallationSection } from './(sections)/(installation)/Installation.section';
import { NatureDeLExploitationSection } from './(sections)/(nature-de-l-exploitation)/NatureDeLExploitation.section';

type Props = { identifiantProjet: IdentifiantProjet.RawType };

export const InstallationPage = ({ identifiantProjet }: Props) => (
  <ColumnPageTemplate
    heading={<Heading2>Installation</Heading2>}
    leftColumn={{
      children: <InstallationSection identifiantProjet={identifiantProjet} />,
    }}
    rightColumn={{
      children: (
        <div className="flex flex-col gap-4 w-full">
          <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
          <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
        </div>
      ),
    }}
  />
);
